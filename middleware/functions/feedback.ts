import { Octokit } from "@octokit/core";
import profanity from "leo-profanity";
import type { FeedbackSubmission } from "../../types.ts";

// GitHub API configuration
const githubToken = Deno.env.get("GITHUB_FEEDBACK_TOKEN");
const githubRepo = Deno.env.get("GITHUB_FEEDBACK_REPO") || "denoland/docs";
const [owner, repo] = githubRepo.split("/");
const projectId = "PVT_kwDOAoGdk84Aj-nW";

// Check if the API key is set
const enableFeedbackMiddleware = !!githubToken;

// Profanity filter configuration
const enableProfanityFilter =
  (Deno.env.get("FEEDBACK_PROFANITY_FILTER") ?? "true").toLowerCase() !==
    "false";
const customProfanityCSV = Deno.env.get("FEEDBACK_PROFANITY_WORDS") || ""; // optional comma-separated words
// Initialize profanity dictionary once
if (enableProfanityFilter) {
  // Use English dictionary by default
  profanity.loadDictionary();
  if (customProfanityCSV.trim()) {
    const extra = customProfanityCSV.split(",").map((w) => w.trim()).filter(
      Boolean,
    );
    if (extra.length) profanity.add(extra);
  }
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Max 5 feedback submissions per hour per IP
const MAX_REQUESTS_PER_PATH = 10; // Max 10 feedback submissions per hour per path
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
// Allow disabling rate limits for local testing
const disableRateLimiting =
  (Deno.env.get("FEEDBACK_DISABLE_RATELIMIT") ?? "false").toLowerCase() ===
    "true";

// Field length constraints (single source of truth)
const MAX_PATH_LENGTH = 500;
const MAX_COMMENT_LENGTH = 2000;
const MAX_CONTACT_LENGTH = 256;

// Suspicious user agent patterns
const SUSPICIOUS_USER_AGENTS = [
  /curl/i,
  /wget/i,
  /postman/i,
  /python/i,
  /node/i,
  /bot/i,
  /crawler/i,
  /scraper/i,
];

// Allowed origins for CORS (add your actual domains)
const ALLOWED_ORIGINS = [
  "https://docs.deno.com",
  "https://deno.com",
  "http://localhost:3000", // For development
  "http://localhost:8000", // For development
];

// Helpers
function checkRateLimit(identifier: string, maxRequests: number): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(identifier);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

function getClientIP(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Minimal JSON response helper with CORS
function jsonResponse(
  data: unknown,
  init?: ResponseInit & { corsHeaders?: Record<string, string> },
): Response {
  const baseCors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  } as const;
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      ...baseCors,
      ...(init?.corsHeaders ?? {}),
      "Content-Type": "application/json",
    },
  });
}

// Validate request origin and headers
function validateRequest(req: Request): { valid: boolean; reason?: string } {
  const userAgent = req.headers.get("user-agent") || "";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Check for suspicious user agents
  if (SUSPICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent))) {
    return { valid: false, reason: "Suspicious user agent detected" };
  }

  // Check origin if present (for CORS requests)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return { valid: false, reason: "Origin not allowed" };
  }

  // Check referer if no origin (for non-CORS requests)
  if (!origin && referer) {
    const isValidReferer = ALLOWED_ORIGINS.some((allowedOrigin) =>
      referer.startsWith(allowedOrigin)
    );
    if (!isValidReferer) {
      return { valid: false, reason: "Invalid referer" };
    }
  }

  return { valid: true };
}

// Enhanced content validation
function validateFeedbackContent(
  submission: FeedbackSubmission,
): { valid: boolean; reason?: string } {
  const { path, sentiment, comment, contact } = submission;

  // Basic field validation
  if (!path || typeof path !== "string" || path.length > MAX_PATH_LENGTH) {
    return { valid: false, reason: "Invalid path" };
  }

  if (!sentiment || !["yes", "no"].includes(sentiment)) {
    return { valid: false, reason: "Invalid sentiment" };
  }

  // If comment is provided, validate it
  if (comment) {
    if (typeof comment !== "string") {
      return { valid: false, reason: "Invalid comment format" };
    }

    if (comment.length < 3) {
      return { valid: false, reason: "Comment too short" };
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      return { valid: false, reason: "Comment too long" };
    }

    if (enableProfanityFilter && profanity.check(comment)) {
      return {
        valid: false,
        reason: "Comment contains inappropriate language",
      };
    }
  }

  // If contact is provided, validate it
  if (contact) {
    if (typeof contact !== "string" || contact.length > MAX_CONTACT_LENGTH) {
      return { valid: false, reason: "Invalid contact format" };
    }
  }

  return { valid: true };
}

// Create Octokit instance with GraphQL support
const octokit = new Octokit({
  auth: githubToken,
});

// Clean up GitHub username by removing @ if present
function cleanGitHubUsername(username: string | undefined): string | undefined {
  if (!username) return undefined;
  return username.startsWith("@") ? username.substring(1) : username;
}

// Add issue to GitHub Project
async function addIssueToProject(issueNodeId: string) {
  console.log(
    `Attempting to add issue (${issueNodeId}) to project (${projectId})`,
  );

  try {
    // The GraphQL mutation for adding an item to a project
    const mutation = `
      mutation AddIssueToProject($projectId: ID!, $contentId: ID!) {
        addProjectV2ItemById(input: {
          projectId: $projectId
          contentId: $contentId
        }) {
          item {
            id
          }
        }
      }
    `;

    // Execute the GraphQL mutation with variables
    const response = await octokit.graphql(mutation, {
      projectId: projectId,
      contentId: issueNodeId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log("Successfully added issue to project.");
    return response;
  } catch (error) {
    console.error("Failed to add issue to project:", error);
    // Log the specific error message for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

// Create GitHub issue for feedback only when comments are provided
const upsertFeedbackIssue = async (
  { path, sentiment, comment, contact, id }: FeedbackSubmission,
) => {
  const cleanedContact = cleanGitHubUsername(contact);

  // Record basic sentiment without creating GitHub issue if no comment
  if (!comment || comment.trim() === "") {
    console.log(
      `Feedback received for ${path}: ${sentiment} (no comment, no GitHub issue created)`,
    );
    return { id: null }; // Return null ID as no GitHub issue was created
  }

  // If comment exists, create or update GitHub issue
  if (id) {
    // If an ID exists, it means we're updating an existing issue
    if (enableProfanityFilter && comment && profanity.check(comment)) {
      throw new Error("Comment rejected due to inappropriate language");
    }
    const commentBody = `
Additional feedback:
${comment ? `\n> ${comment}` : "No additional comment provided"}
${cleanedContact ? `\n**GitHub User:** @${cleanedContact}` : ""}
`;

    try {
      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner,
          repo,
          issue_number: parseInt(id),
          body: commentBody,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      return { id };
    } catch (error) {
      console.error("GitHub API error (add comment):", error);
      throw error;
    }
  } else {
    // Create a new issue
    if (enableProfanityFilter && comment && profanity.check(comment)) {
      throw new Error("Comment rejected due to inappropriate language");
    }
    const title = `Feedback: ${path} - ${
      sentiment === "yes" ? "Positive" : "Needs Improvement"
    }`;

    const body = `
## Documentation Feedback

**Path:** [${path}](https://docs.deno.com${path})
**Helpful:** ${sentiment === "yes" ? "Yes ✅" : "No ❌"}

${comment ? `**Feedback:**\n> ${comment}` : "No additional comment provided"}
${cleanedContact ? `\n**GitHub User:** @${cleanedContact}` : ""}

---
*This issue was automatically created from the documentation feedback system.*
`;

    try {
      // Define labels explicitly and ensure they are exactly as defined in GitHub
      const labelNames = [];

      // Add sentiment label
      if (sentiment === "yes") {
        labelNames.push("positive");
      } else {
        labelNames.push("needs-improvement");
      }

      // Always add a feedback label
      labelNames.push("feedback");

      console.log(
        `Creating issue with labels: ${labelNames.join(", ")}`,
      );

      // Create the issue with specified labels
      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
          title,
          body,
          labels: labelNames,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      console.log(`Created GitHub issue #${response.data.number} for ${path}`);

      // Let's also verify if the issue was created with labels
      if (response.data.labels && response.data.labels.length > 0) {
        const labelNames =
          (response.data.labels as Array<string | { name?: string }>)
            .map((l) => typeof l === "string" ? l : l.name)
            .filter(Boolean)
            .join(", ");
        console.log(`Issue created with labels: ${labelNames}`);
      } else {
        console.warn("Issue created but no labels were attached");

        // Try adding labels in a separate request if they weren't added initially
        try {
          await octokit.request(
            "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
            {
              owner,
              repo,
              issue_number: response.data.number,
              labels: labelNames,
              headers: {
                "X-GitHub-Api-Version": "2022-11-28",
              },
            },
          );
          console.log("Labels added in separate request");
        } catch (labelError) {
          console.error(
            "Failed to add labels in separate request:",
            labelError,
          );
        }
      }

      // Verify we have the node_id before attempting to add to project
      if (response.data.node_id) {
        console.log(`Issue node_id: ${response.data.node_id}`);
        try {
          await addIssueToProject(response.data.node_id);
        } catch (projectError) {
          console.error(
            "Project integration failed but issue was created:",
            projectError,
          );
        }
      } else {
        console.error("Missing node_id in GitHub response:", response.data);
      }

      return { id: response.data.number };
    } catch (error) {
      console.error("GitHub API error (create issue):", error);
      throw error;
    }
  }
};

export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  if (!enableFeedbackMiddleware) {
    return jsonResponse({ error: "Feedback API is not enabled" }, {
      status: 500,
    });
  }

  // Get client IP for rate limiting
  const clientIP = getClientIP(req);

  // Validate request origin and headers
  const requestValidation = validateRequest(req);
  if (!requestValidation.valid) {
    console.warn(
      `Request blocked: ${requestValidation.reason} from IP: ${clientIP}`,
    );
    return jsonResponse({
      error: "Request validation failed",
      reason: requestValidation.reason,
    }, { status: 403 });
  }

  // Check IP-based rate limiting
  if (
    !disableRateLimiting &&
    !checkRateLimit(`ip:${clientIP}`, MAX_REQUESTS_PER_IP)
  ) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return jsonResponse({
      error: "Too many requests",
      message: "Please wait before submitting more feedback",
    }, { status: 429, corsHeaders: { "Retry-After": "3600" } });
  }

  let submission: FeedbackSubmission;

  try {
    submission = await req.json() as FeedbackSubmission;
  } catch (error) {
    return jsonResponse({
      error: "Invalid JSON payload",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 400 });
  }

  // Validate feedback content
  const contentValidation = validateFeedbackContent(submission);
  if (!contentValidation.valid) {
    console.warn(
      `Content validation failed: ${contentValidation.reason} from IP: ${clientIP}`,
    );
    return jsonResponse({
      error: "Content validation failed",
      reason: contentValidation.reason,
    }, { status: 400 });
  }

  const { path, sentiment, comment, contact, id } = submission;

  // Check path-based rate limiting
  if (
    !disableRateLimiting &&
    !checkRateLimit(`path:${path}`, MAX_REQUESTS_PER_PATH)
  ) {
    console.warn(`Path rate limit exceeded for: ${path} from IP: ${clientIP}`);
    return jsonResponse({
      error: "Too many requests for this page",
      message: "This page has received too much feedback recently",
    }, { status: 429, corsHeaders: { "Retry-After": "3600" } });
  }

  // Cap data at sensible max lengths (already validated above, but extra safety)
  const contactCapped = contact && contact.length > MAX_CONTACT_LENGTH
    ? contact.slice(0, MAX_CONTACT_LENGTH)
    : contact;

  const commentCapped = comment && comment.length > MAX_COMMENT_LENGTH
    ? comment.slice(0, MAX_COMMENT_LENGTH)
    : comment;

  try {
    const response = await upsertFeedbackIssue({
      path: path,
      sentiment: sentiment,
      comment: commentCapped,
      contact: contactCapped,
      id: id,
    });

    if (response.id) {
      console.log(
        `GitHub issue created/updated successfully from IP: ${clientIP}`,
      );
    } else {
      console.log(
        `Feedback recorded without GitHub issue from IP: ${clientIP}`,
      );
    }

    return jsonResponse({ success: true, id: response.id });
  } catch (error) {
    console.error(`GitHub issue creation failed from IP: ${clientIP}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return jsonResponse({
      error: "Failed to process feedback",
      details: errorMessage,
    }, { status: 500 });
  }
}
