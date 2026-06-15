/**
 * @title Upload files to S3-compatible storage
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N -E <url>
 * @resource {https://www.npmjs.com/package/@aws-sdk/client-s3} @aws-sdk/client-s3 on npm
 * @resource {https://developers.cloudflare.com/r2/api/s3/api/} Cloudflare R2 S3 API
 * @group Web frameworks and libraries
 *
 * The AWS SDK works with any S3-compatible store, including Amazon S3 and
 * Cloudflare R2. This example uploads an object, then creates a presigned URL
 * that grants temporary read access without exposing your credentials. Set
 * AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and S3_BUCKET; for R2 also set
 * S3_ENDPOINT to your account's endpoint.
 */

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

// region "auto" and a custom endpoint target R2; for Amazon S3, set a real
// region and omit the endpoint.
const s3 = new S3Client({
  region: Deno.env.get("AWS_REGION") ?? "auto",
  endpoint: Deno.env.get("S3_ENDPOINT"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

const bucket = Deno.env.get("S3_BUCKET")!;

// Upload an object. Body also accepts a stream or Uint8Array for larger files.
await s3.send(
  new PutObjectCommand({
    Bucket: bucket,
    Key: "hello.txt",
    Body: "Hello from Deno!",
    ContentType: "text/plain",
  }),
);
console.log("Uploaded hello.txt");

// Presign a GET URL so a browser can download the object directly for a
// limited time, without your credentials.
const url = await getSignedUrl(
  s3,
  new GetObjectCommand({ Bucket: bucket, Key: "hello.txt" }),
  { expiresIn: 3600 },
);
console.log("Download URL (valid 1 hour):", url);
