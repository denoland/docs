import { google } from "googleapis";

export default async function feedbackRequestHandler(
  req: Request,
): Promise<Response> {
  const privateKey = Deno.env.get("FEEDBACK_PRIVATE_KEY");
  const serviceAccountEmail = Deno.env.get("FEEDBACK_SERVICE_ACCOUNT_EMAIL");
  const spreadsheetId = Deno.env.get("FEEDBACK_SHEET_ID");
  const enableFeedbackMiddleware = privateKey && serviceAccountEmail &&
    spreadsheetId;

  if (!enableFeedbackMiddleware) {
    return new Response(
      "Feedback API is not enabled - have you set the correct environment variables?",
      { status: 500 },
    );
  }

  const sheetId = 1;
  const rowData = ["John Doe", "johndoe@example.com", 1, 2, 3];

  // Load rowData out of req here!

  try {
    const sheets = google.sheets({ version: "v4" });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Sheet${sheetId}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    }, {
      auth: new google.auth.JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/spreadsheets",
        ],
      }),
    });

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error appending row:", error);
    return new Response("Failure", { status: 500 });
  }
}
