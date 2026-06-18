// This runs in the browser
// deno-lint-ignore-file no-window
import type { FeedbackSubmission } from "../types.ts";

// Keep in sync with MAX_COMMENT_LENGTH in middleware/functions/feedback.ts
// and the maxlength on the textarea in _components/Feedback.tsx
const MAX_COMMENT_LENGTH = 2000;

let lastFeedbackItemId: string | null = null;
const feedbackYes = document.getElementById("feedback-yes");
const feedbackNo = document.getElementById("feedback-no");
const feedbackForm = document.getElementById("feedback-form");
const feedbackSection = document.getElementById("feedback-section");
const feedbackComment = document.getElementById(
  "feedback-comment",
) as HTMLTextAreaElement | null;
const feedbackCommentCount = document.getElementById("feedback-comment-count");

feedbackComment?.addEventListener("input", () => {
  const length = feedbackComment.value.length;
  if (feedbackCommentCount) {
    feedbackCommentCount.textContent = `${length} / ${MAX_COMMENT_LENGTH}`;
    // Highlight the counter once the comment reaches the limit
    const atLimit = length >= MAX_COMMENT_LENGTH;
    feedbackCommentCount.classList.toggle("text-red-600", atLimit);
    feedbackCommentCount.classList.toggle("dark:text-red-400", atLimit);
    feedbackCommentCount.classList.toggle("text-gray-600", !atLimit);
    feedbackCommentCount.classList.toggle("dark:text-gray-400", !atLimit);
  }
});

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

feedbackForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm as HTMLFormElement);
  const form = Object.fromEntries(formData.entries());
  const ok = await sendFeedback({
    sentiment: form["feedback-vote"] as "yes" | "no",
    comment: form["feedback-comment"] as string,
    contact: form["feedback-contact"] as string,
  });
  if (feedbackSection) {
    feedbackSection.innerHTML = ok
      ? "<p>Thank you for helping make the Deno docs awesome!</p>"
      : "<p>Sorry, something went wrong sending your feedback. Please try again later.</p>";
  }
});

// "Request a new guide" box on the Examples landing page; reuses the
// feedback endpoint, which files a GitHub issue when a comment is present.
const guideRequestForm = document.getElementById("guide-request-form");
const guideRequestBox = document.getElementById("guide-request-box");

guideRequestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(guideRequestForm as HTMLFormElement);
  const form = Object.fromEntries(formData.entries());
  const comment = (form["guide-request-comment"] as string)?.trim();
  if (!comment) return;
  sendFeedback({
    sentiment: "no",
    comment: `[Guide request] ${comment}`,
    contact: form["guide-request-contact"] as string,
  });
  if (guideRequestBox) {
    guideRequestBox.innerHTML =
      "<p>Thanks! Your request has been filed — we'll take a look.</p>";
  }
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

  return result.ok;
}
