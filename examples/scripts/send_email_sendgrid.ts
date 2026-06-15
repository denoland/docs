/**
 * @title Send email with SendGrid
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://www.npmjs.com/package/@sendgrid/mail} @sendgrid/mail on npm
 * @resource {https://www.twilio.com/docs/sendgrid/for-developers/sending-email/quickstart-nodejs} SendGrid Node.js quickstart
 * @group Web frameworks and libraries
 *
 * SendGrid is a widely used transactional email service. Its Node.js SDK runs
 * in Deno from npm. This example sends a single HTML email. The from address
 * must be a verified sender or domain in your SendGrid account. Set
 * SENDGRID_API_KEY before running.
 */

import sgMail from "npm:@sendgrid/mail";

sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY")!);

// send resolves with the API response; a 202 status means SendGrid accepted
// the message for delivery.
const [response] = await sgMail.send({
  to: "recipient@example.com",
  from: "you@example.com", // a verified sender in your SendGrid account
  subject: "Hello from Deno",
  html: "<p>This email was sent with <strong>SendGrid</strong> from Deno.</p>",
});

console.log("Status:", response.statusCode);
