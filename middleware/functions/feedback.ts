import { Client } from "npm:@notionhq/client";
import type { FeedbackSubmission } from "../../types.ts";

// Collecting entries to an internal Notion page
const apiKey = Deno.env.get("NOTION_FEEDBACK_API_KEY");
const databaseID = Deno.env.get("NOTION_FEEDBACK_DATABASE_ID");

// Check if the API key and database ID are set
const enableFeedbackMiddleware = apiKey && databaseID;

// Connect to Notion
const notion = new Client({ auth: apiKey });

// Insert data into Notion
const insertData = async (
  { path, sentiment, comment, contact, id }: FeedbackSubmission,
) => {
  // Assemble the properties to send to the API
  type Properties = {
    "Docs Url": { title: { text: { content: string } }[] };
    "Helpful?": { rich_text: { text: { content: "yes" | "no" } }[] };
    Feedback?: { rich_text: { text: { content: string } }[] };
    Email?: { email: string };
  };

  const properties: Properties = {
    "Docs Url": { "title": [{ "text": { "content": path } }] },
    "Helpful?": { "rich_text": [{ "text": { "content": sentiment } }] },
  };

  if (comment) {
    properties["Feedback"] = {
      "rich_text": [{ "text": { "content": comment } }],
    };
  }
  if (contact) {
    properties["Email"] = { "email": contact };
  }

  // update to or create the record
  if (id) {
    return await notion.pages.update({
      page_id: id,
      properties: properties,
    });
  } else {
    return await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseID || "",
      },
      properties: properties,
    });
  }
};

// Handle the request
export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  if (!enableFeedbackMiddleware) {
    return new Response(
      "Feedback API is not enabled - have you set the correct environment variables?",
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

    return new Response(
      JSON.stringify({
        success: true,
        id: response.id,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to insert data into Notion",
      }),
      { status: 500 },
    );
  }
}
