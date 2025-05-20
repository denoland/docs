import { Octokit } from "npm:@octokit/core";
import type { FeedbackSubmission } from "../../types.ts";

// GitHub API configuration
const githubToken = Deno.env.get("GITHUB_FEEDBACK_TOKEN");
const githubRepo = Deno.env.get("GITHUB_FEEDBACK_REPO") || "denoland/docs";
const [owner, repo] = githubRepo.split("/");

// Check if the API key is set
const enableFeedbackMiddleware = !!githubToken;

// Create Octokit instance
const octokit = new Octokit({
  auth: githubToken,
});

// Create GitHub issue for feedback only when comments are provided
const insertData = async (
  { path, sentiment, comment, contact, id }: FeedbackSubmission,
) => {
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
${contact ? `\n**GitHub User:** @${contact}` : ""}
`;

    try {
      const response = await octokit.request(
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

    let body = `
## Documentation Feedback

**Path:** ${path}
**Helpful:** ${sentiment === "yes" ? "Yes ✅" : "No ❌"}

${comment ? `**Feedback:**\n> ${comment}` : "No additional comment provided"}
${contact ? `\n**GitHub User:** @${contact}` : ""}

---
*This issue was automatically created from the documentation feedback system.*
`;

    try {
      const response = await octokit.request(
        "POST /repos/{owner}/{repo}/issues",
        {
          owner,
          repo,
          title,
          body,
          labels: [
            "feedback",
            sentiment === "yes" ? "positive" : "needs-improvement",
          ],
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      console.log(
        `Created GitHub issue #${response.data.number} for feedback on ${path}`,
      );
      return { id: response.data.number };
    } catch (error) {
      console.error(`GitHub API error response (issue):`, error);
      throw error;
    }
  }
};

// Handle the request
export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  if (!enableFeedbackMiddleware) {
    return new Response(
      "Feedback API is not enabled - have you set the GitHub token?",
      { status: 500 },
    );
  }

  // Gather data from submission
  const submission = await req.json() as FeedbackSubmission;
  const { path, sentiment, comment, contact, id } = submission;

  // Cap data at sensible max lengths
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
      console.log("GitHub issue created/updated successfully");
    } else {
      console.log("Feedback recorded without GitHub issue");
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: response.id,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("GitHub issue creation failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Failed to create GitHub issue",
        details: errorMessage,
      }),
      { status: 500 },
    );
  }
}
