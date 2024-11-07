// This runs in the browser
// deno-lint-ignore-file no-window
import type { FeedbackSubmission } from "./types.ts";

let lastFeedbackItemId: string | null = null;
const feedbackYes = document.getElementById("feedback-yes");
const feedbackNo = document.getElementById("feedback-no");
const feedbackForm = document.getElementById("feedback-form");

feedbackYes?.addEventListener("click", () => {
  sendFeedback({
    sentiment: "yes",
  });
});

feedbackNo?.addEventListener("click", () => {
  sendFeedback({
    sentiment: "no",
  });
});

feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm as HTMLFormElement);
  const form = Object.fromEntries(formData.entries());
  sendFeedback({
    sentiment: form["feedback-vote"] as "yes" | "no",
    comment: form["feedback-comment"] as string,
    contact: form["feedback-contact"] as string,
  });
  feedbackForm.innerHTML = "<p>Thank you for your feedback!</p>";
});

async function sendFeedback(feedback: Partial<FeedbackSubmission>) {
  feedback.path = feedback.path || new URL(window.location.href).pathname;
  feedback.id = lastFeedbackItemId ? lastFeedbackItemId : null;

  const result = await fetch("/_api/send-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });

  const responseBody = await result.json();
  lastFeedbackItemId = responseBody.id;

  if (!result.ok) {
    console.error("Failed to send feedback", responseBody);
  }
}
