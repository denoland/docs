import { google } from "googleapis";
import type { FeedbackSubmission } from "../../types.ts";

const { privateKey } = JSON.parse(Deno.env.get("FEEDBACK_PRIVATE_KEY") || "{}");
const serviceAccountEmail = Deno.env.get("FEEDBACK_SERVICE_ACCOUNT_EMAIL");
const spreadsheetId = Deno.env.get("FEEDBACK_SHEET_ID");
const enableFeedbackMiddleware = privateKey && serviceAccountEmail &&
  spreadsheetId;

export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  if (!enableFeedbackMiddleware) {
    return new Response(
      "Feedback API is not enabled - have you set the correct environment variables?",
      { status: 500 },
    );
  }

  const submission = await req.json() as FeedbackSubmission;
  const { path, sentiment, comment, contact, id } = submission;

  const contactCapped = contact && contact.length > 256
    ? contact?.slice(0, 256)
    : contact;

  const commentCapped = comment && comment.length > 1000
    ? comment?.slice(0, 1000)
    : comment;

  const rowData = [path, sentiment, contactCapped || "", commentCapped || ""];

  try {
    const sheets = google.sheets({ version: "v4" });

    const request = {
      spreadsheetId,
      range: id ? atob(id) : `Sheet1!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    };

    const auth = getAuth();

    let response: any;
    let updates: any;

    // The google package claims that it returns nothing but it actually does.
    if (id) {
      response = await sheets.spreadsheets.values.update(request, { auth });
      updates = response.data;
    } else {
      response = await sheets.spreadsheets.values.append(request, { auth });
      updates = response.data.updates;
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: btoa(updates.updatedRange),
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error appending row:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

function getAuth(): any {
  return new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
}
