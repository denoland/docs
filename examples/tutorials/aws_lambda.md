---
title: "How to Deploy Deno to AWS Lambda"
description: "Step-by-step tutorial on deploying Deno applications to AWS Lambda. Learn about Docker containerization, ECR repositories, function configuration, and how to set up serverless Deno apps on AWS."
url: /examples/aws_lambda_tutorial/
oldUrl:
- /runtime/tutorials/aws_lambda/
---

AWS Lambda is a serverless computing service provided by Amazon Web Services. It
allows you to run code without provisioning or managing servers.

Here's a step by step guide to deploying a Deno app to AWS Lambda using Docker.

The pre-requisites for this are:

- [`docker` CLI](https://docs.docker.com/reference/cli/docker/)
- an [AWS account](https://aws.amazon.com)
- [`aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Step 1: Create a Deno App

Create a new Deno app using the following code:

```ts title="main.ts"
Deno.serve((req) => new Response("Hello World from Deno on AWS Lambda!"));
```

Save this code in a file named `main.ts`.

## Step 2: Create a Dockerfile

Create a new file named `Dockerfile` with the following content:

```Dockerfile
FROM amazon/aws-lambda-nodejs:20 as lambda-base

# Install Deno
RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL=/root/.deno
ENV PATH=${DENO_INSTALL}/bin:${PATH}

# Copy function code
WORKDIR ${LAMBDA_TASK_ROOT}
COPY . ${LAMBDA_TASK_ROOT}

# Create wrapper script for Lambda
RUN echo '#!/bin/bash\n\
NODE_OPTIONS="--experimental-fetch" exec node lambda-adapter.js\
' > /var/runtime/bootstrap \
&& chmod +x /var/runtime/bootstrap

# Create Lambda adapter script
RUN echo 'const { spawn } = require("child_process");\n\
const { readFileSync } = require("fs");\n\
\n\
// Parse Lambda runtime API address\n\
const API_ADDRESS = process.env.AWS_LAMBDA_RUNTIME_API;\n\
\n\
// Start Deno server in background\n\
const deno = spawn("deno", ["run", "--allow-net", "--allow-env", "main.ts"]);\n\
deno.stdout.on("data", data => console.log(`stdout: ${data}`));\n\
deno.stderr.on("data", data => console.error(`stderr: ${data}`));\n\
\n\
// Wait for server to start\n\
const sleep = ms => new Promise(r => setTimeout(r, ms));\n\
const waitForServer = async () => {\n\
  let attempt = 0;\n\
  while (attempt < 10) {\n\
    try {\n\
      await fetch("http://localhost:8000");\n\
      return;\n\
    } catch (e) {\n\
      attempt++;\n\
      await sleep(500);\n\
    }\n\
  }\n\
  throw new Error("Server failed to start");\n\
};\n\
\n\
// Handle Lambda requests\n\
const handleRequest = async () => {\n\
  try {\n\
    // Get event\n\
    const res = await fetch(`http://${API_ADDRESS}/2018-06-01/runtime/invocation/next`);\n\
    const requestId = res.headers.get("lambda-runtime-aws-request-id");\n\
    const event = await res.json();\n\
\n\
    // Forward to Deno server\n\
    const denoRes = await fetch("http://localhost:8000");\n\
    const body = await denoRes.text();\n\
\n\
    // Return response\n\
    await fetch(\n\
      `http://${API_ADDRESS}/2018-06-01/runtime/invocation/${requestId}/response`,\n\
      {\n\
        method: "POST",\n\
        body: JSON.stringify({\n\
          statusCode: denoRes.status,\n\
          headers: Object.fromEntries(denoRes.headers.entries()),\n\
          body,\n\
          isBase64Encoded: false,\n\
        }),\n\
      }\n\
    );\n\
  } catch (error) {\n\
    console.error("Error:", error);\n\
    // Report error\n\
    await fetch(\n\
      `http://${API_ADDRESS}/2018-06-01/runtime/invocation/${requestId}/error`,\n\
      {\n\
        method: "POST",\n\
        body: JSON.stringify({\n\
          errorMessage: error.message,\n\
          errorType: error.constructor.name,\n\
          stackTrace: error.stack.split("\\n"),\n\
        }),\n\
      }\n\
    );\n\
  }\n\
};\n\
\n\
// Main function\n\
const main = async () => {\n\
  try {\n\
    await waitForServer();\n\
    console.log("Server started successfully");\n\
\n\
    // Process events in a loop\n\
    while (true) {\n\
      await handleRequest();\n\
    }\n\
  } catch (error) {\n\
    console.error("Fatal error:", error);\n\
    process.exit(1);\n\
  }\n\
};\n\
\n\
main();\n\
' > ${LAMBDA_TASK_ROOT}/lambda-adapter.js

EXPOSE 8000
CMD ["node", "lambda-adapter.js"]
```

This Dockerfile uses the official `amazon/aws-lambda-nodejs:20` base image,
which is officially supported by AWS Lambda. We then:

1. Install Deno using the official install script
2. Set up a custom bootstrap script that Lambda will use to start the function
3. Create a Node.js adapter script that:
   - Starts your Deno application as a child process
   - Acts as a bridge between the AWS Lambda runtime API and your Deno server
   - Forwards requests and responses between Lambda and your Deno app

:::note

It may seem counterintuitive to use Node.js Lambda base when we're trying to
deploy a Deno application. This approach is necessary because of AWS Lambda's
Runtime Architecture Lambda's Runtime Interface. AWS Lambda has specific runtime
interfaces designed to work with officially supported runtimes (like Node.js,
Python, Java, etc.). Deno is not yet an officially supported runtime.

When deploying a container to Lambda, AWS expects it to implement the Lambda
Runtime API, which follows specific protocols for receiving events and sending
responses. Node.js is Needed as a bridge. The Node.js layer serves as an adapter
AWS Lambda's runtime API expectations and your Deno application.

:::

## Step 3: Build the Docker Image

Build the Docker image using the following command:

```bash
docker build -t deno-lambda .
```

## Step 4: Create an ECR Repository and Push the Image

First, create an ECR repository:

```bash
aws ecr create-repository --repository-name deno-lambda --region us-east-1
```

Note the repository URI in the output, it will look like:
`<account_id>.dkr.ecr.us-east-1.amazonaws.com/deno-lambda`

Authenticate Docker with ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com
```

Tag and push your Docker image:

```bash
docker tag deno-lambda:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/deno-lambda:latest
docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/deno-lambda:latest
```

## Step 5: Create an AWS Lambda Function

1. Go to the [AWS Lambda console](https://console.aws.amazon.com/lambda/home)
2. Click "Create function"
3. Select "Container image"
4. Enter a function name (e.g., "deno-function")
5. Under "Container image URI", click "Browse images"
6. Select the repository and image you just pushed
7. Click "Create function"

After the function is created:

1. In the "Configuration" tab, click "Edit" in the "General configuration"
   section
2. Set the timeout to at least 30 seconds (to allow for Deno startup time)
3. Click "Save"

To create a function URL:

1. Go to the "Configuration" tab
2. Select "Function URL" from the left sidebar
3. Click "Create function URL"
4. For "Auth type", select "NONE" (for public access)
5. Click "Save"

## Step 6: Test the Lambda Function

You can now visit the provided function URL to see your Deno application running
on AWS Lambda!

For more advanced setups, you might want to:

- Configure API Gateway to handle more complex HTTP routing
- Set up environment variables for your Deno application
- Create a CI/CD pipeline using GitHub Actions to automate deployments

## Troubleshooting

If you encounter issues:

1. **Cold start timeouts**: Increase the Lambda function timeout in the
   configuration
2. **Memory issues**: Increase the allocated memory for your Lambda function
3. **Permissions errors**: Check the CloudWatch logs for specific error messages
4. **Request format issues**: Modify the lambda-adapter.js script to handle
   different types of Lambda events

## Next Steps

Now that you've successfully deployed a simple Deno application to AWS Lambda,
consider exploring:

- [AWS SAM](https://aws.amazon.com/serverless/sam/) for more complex serverless
  deployments
- [API Gateway integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)
- [AWS CDK](https://aws.amazon.com/cdk/) for infrastructure as code

🦕 You've successfully deployed a Deno application to AWS Lambda!
