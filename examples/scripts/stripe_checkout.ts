/**
 * @title Accept payments with Stripe Checkout
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://docs.stripe.com/checkout/quickstart} Stripe Checkout
 * @resource {https://www.npmjs.com/package/stripe} stripe on npm
 * @group Web frameworks and libraries
 *
 * Stripe Checkout hosts the payment page for you. This server starts a
 * checkout session and redirects the customer to it, then verifies the webhook
 * Stripe sends when payment completes. On Deno, verify with the async
 * constructEventAsync, which uses Web Crypto instead of Node APIs. Set
 * STRIPE_SECRET_KEY, STRIPE_PRICE_ID, and STRIPE_WEBHOOK_SECRET.
 */

import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Start a checkout session and send the customer to Stripe's hosted page.
  if (req.method === "POST" && url.pathname === "/checkout") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: Deno.env.get("STRIPE_PRICE_ID")!, quantity: 1 }],
      success_url: "http://localhost:8000/success",
      cancel_url: "http://localhost:8000/cancel",
    });
    return Response.redirect(session.url!, 303);
  }

  // Stripe calls this URL when events happen. Always verify the signature so
  // you know the request really came from Stripe.
  if (req.method === "POST" && url.pathname === "/webhook") {
    const signature = req.headers.get("stripe-signature")!;
    const body = await req.text();
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      );
    } catch (err) {
      return new Response(`Invalid signature: ${err}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(`Payment received for session ${session.id}`);
      // Fulfill the order here.
    }
    return new Response("ok");
  }

  return new Response("Not found", { status: 404 });
}

Deno.serve(handler);
