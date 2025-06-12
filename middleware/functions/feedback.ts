import { Octokit } from "npm:@octokit/core";
import type { FeedbackSubmission } from "../../types.ts";

// GitHub API configuration
const githubToken = Deno.env.get("GITHUB_FEEDBACK_TOKEN");
const githubRepo = Deno.env.get("GITHUB_FEEDBACK_REPO") || "denoland/docs";
const [owner, repo] = githubRepo.split("/");
const projectId = "PVT_kwDOAoGdk84Aj-nW";

// Check if the API key is set
const enableFeedbackMiddleware = !!githubToken;

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
  // Clean up the GitHub username
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
        console.log(
          `Issue created with labels: ${
            response.data.labels.map((l: any) => l.name).join(", ")
          }`,
        );
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
      console.error(`GitHub API error response (issue):`, error);
      throw error;
    }
  }
};

export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  if (!enableFeedbackMiddleware) {
    return new Response(
      "Feedback API is not enabled - have you set the GitHub token?",
      { status: 500 },
    );
  }

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
