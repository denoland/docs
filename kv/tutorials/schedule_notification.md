# Schedule a notification for a future date

A common use case for [queues](../manual/queue_overview.md) is scheduling work
to be completed at some point in the future. In this tutorial, we'll show how to
schedule a notification to be sent out via email using the
[Courier API](https://www.courier.com/). Our application will run on
[Deno Deploy](https://www.deno.com/deploy), using the built-in KV and queue API
implementations available there with zero configuration.

## Sign up for Courier

To fully complete this tutorial, you'll need to
[sign up for Courier](https://app.courier.com/signup). Of course the techniques
you'll see here would just as easily apply to any notification service, from
[Amazon SNS](https://aws.amazon.com/sns/) to [Twilio](https://www.twilio.com),
but Courier provides an easy-to-use notification API that you can use with a
personal GMail account for testing (in addition to all the other neat things it
can do).
