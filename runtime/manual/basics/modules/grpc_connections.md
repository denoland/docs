---
title: "gRPC Connections"
---

gRPC is a high-performance, open-source, universal RPC framework that enables efficient communication between services. With gRPC support, you can build real-time, interactive applications that leverage the low-latency communication capabilities of gRPC.

Deno supports gRPC connections using the `@grpc/grpc-js` client library from npm. This enables you to connect to gRPC services, such as Google Cloud Platform, directly from Deno. For example, you can classify an image using the Google Cloud Vision API:

```typescript title="classifyImage.ts"

import { ImageAnnotatorClient } from "npm:@google-cloud/vision";

const client = new ImageAnnotatorClient();
const [result] = await client.labelDetection("./cat_dog.webp");
const labels = result.labelAnnotations;
console.log("Labels:");
for (const label of labels) {
  console.log(" - ", label.description);
}
```
