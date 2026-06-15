/**
 * @title Send email with Resend
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://resend.com/docs/send-with-nodejs} Resend Node.js SDK
 * @resource {https://www.npmjs.com/package/resend} resend on npm
 * @group Web frameworks and libraries
 *
 * Transactional email, like sign-up confirmations and receipts, is a common
 * need. Resend sends it with a small API. This example sends one HTML email;
 * the onboarding@resend.dev sender works for testing without verifying a
 * domain. Set RESEND_API_KEY before running.
 */

import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

// send returns either data with the message id, or an error. Check error
// rather than relying on a thrown exception.
const { data, error } = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "delivered@resend.dev",
  subject: "Hello from Deno",
  html: "<p>This email was sent with <strong>Resend</strong> from Deno.</p>",
});

if (error) {
  console.error("Failed to send:", error);
} else {
  console.log("Sent message:", data?.id);
}
