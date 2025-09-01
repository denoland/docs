import { Octokit } from "npm:@octokit/core";
import type { FeedbackSubmission } from "../../types.ts";

// GitHub API configuration
const githubToken = Deno.env.get("GITHUB_FEEDBACK_TOKEN");
const githubRepo = Deno.env.get("GITHUB_FEEDBACK_REPO") || "denoland/docs";
const [owner, repo] = githubRepo.split("/");
const projectId = "PVT_kwDOAoGdk84Aj-nW";

// Check if the API key is set
const enableFeedbackMiddleware = !!githubToken;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Max 5 feedback submissions per hour per IP
const MAX_REQUESTS_PER_PATH = 10; // Max 10 feedback submissions per hour per path
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

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

// Rate limiting function
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
  if (!path || typeof path !== "string" || path.length > 500) {
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

    if (comment.length > 2000) {
      return { valid: false, reason: "Comment too long" };
    }
  }

  // If contact is provided, validate it
  if (contact) {
    if (typeof contact !== "string" || contact.length > 256) {
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

// Add issue to GitHub Project with enhanced debugging
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

    console.log("Successfully added issue to project with response:", response);
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
const insertData = async (
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
    const commentBody = `
Additional feedback:
${comment ? `\n> ${comment}` : "No additional comment provided"}
${cleanedContact ? `\n**GitHub User:** @${cleanedContact}` : ""}
`;

    try {
      const _response = await octokit.request(
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
      console.error(`GitHub API error response (comment):`, error);
      throw error;
    }
  } else {
    // Create a new issue
    const title = `Feedback: ${path} - ${
      sentiment === "yes" ? "Positive" : "Needs Improvement"
    }`;

    const body = `
## Documentation Feedback

**Path:** ${path}
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
        `Attempting to create issue with labels: ${labelNames.join(", ")}`,
      );

      // Make a separate API call to check if these labels exist
      try {
        const labelsResponse = await octokit.request(
          "GET /repos/{owner}/{repo}/labels",
          {
            owner,
            repo,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );
        console.log(`Found ${labelsResponse.data.length} labels in repo`);
      } catch (labelError) {
        console.warn("Could not verify labels existence:", labelError);
        // Continue anyway - we'll still try to use the labels
      }

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

      console.log(
        `Created GitHub issue #${response.data.number} for feedback on ${path}`,
      );

      // Let's also verify if the issue was created with labels
      if (response.data.labels && response.data.labels.length > 0) {
        const labelNames = response.data.labels
          .map((l) => typeof l === "string" ? l : l.name)
          .filter(Boolean)
          .join(", ");
        console.log(`Issue created with labels: ${labelNames}`);
      } else {
        console.warn("Issue created but no labels were attached");

        // Try adding labels in a separate request if they weren't added initially
        try {
          const _labelResponse = await octokit.request(
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
      console.error(`GitHub API error response (issue):`, error);
      throw error;
    }
  }
};

export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  // CORS headers for preflight requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  if (!enableFeedbackMiddleware) {
    return new Response(
      JSON.stringify({ error: "Feedback API is not enabled" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Validate request origin and headers
  const requestValidation = validateRequest(req);
  if (!requestValidation.valid) {
    console.warn(
      `Request blocked: ${requestValidation.reason} from IP: ${clientIP}`,
    );
    return new Response(
      JSON.stringify({
        error: "Request validation failed",
        reason: requestValidation.reason,
      }),
      {
        status: 403,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Check IP-based rate limiting
  if (!checkRateLimit(`ip:${clientIP}`, MAX_REQUESTS_PER_IP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        message: "Please wait before submitting more feedback",
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": "3600", // 1 hour
        },
      },
    );
  }

  let submission: FeedbackSubmission;

  try {
    submission = await req.json() as FeedbackSubmission;
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Invalid JSON payload",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  // Validate feedback content
  const contentValidation = validateFeedbackContent(submission);
  if (!contentValidation.valid) {
    console.warn(
      `Content validation failed: ${contentValidation.reason} from IP: ${clientIP}`,
    );
    return new Response(
      JSON.stringify({
        error: "Content validation failed",
        reason: contentValidation.reason,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  const { path, sentiment, comment, contact, id } = submission;

  // Check path-based rate limiting
  if (!checkRateLimit(`path:${path}`, MAX_REQUESTS_PER_PATH)) {
    console.warn(`Path rate limit exceeded for: ${path} from IP: ${clientIP}`);
    return new Response(
      JSON.stringify({
        error: "Too many requests for this page",
        message: "This page has received too much feedback recently",
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": "3600", // 1 hour
        },
      },
    );
  }

  // Cap data at sensible max lengths (already validated above, but extra safety)
  const contactCapped = contact && contact.length > 256
    ? contact?.slice(0, 256)
    : contact;

  const commentCapped = comment && comment.length > 1000
    ? comment?.slice(0, 1000)
    : comment;

  try {
    const response = await insertData({
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

    return new Response(
      JSON.stringify({
        success: true,
        id: response.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(`GitHub issue creation failed from IP: ${clientIP}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to process feedback",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}
