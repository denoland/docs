---
title: "How to Deploy Deno to AWS Lambda"
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
Deno.serve((req) => new Response("Hello World!"));
```

Save this code in a file named `main.ts`.

## Step 2: Create a Dockerfile

Create a new file named `Dockerfile` with the following content:

```Dockerfile
# Set up the base image
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS aws-lambda-adapter
FROM denoland/deno:bin-1.45.2 AS deno_bin
FROM debian:bookworm-20230703-slim AS deno_runtime
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=deno_bin /deno /usr/local/bin/deno
ENV PORT=8000
EXPOSE 8000
RUN mkdir /var/deno_dir
ENV DENO_DIR=/var/deno_dir

# Copy the function code
WORKDIR "/var/task"
COPY . /var/task

# Warmup caches
RUN timeout 10s deno run -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "run", "-A", "main.ts"]
```

This Dockerfile uses the
[`aws-lambda-adapter`](https://github.com/awslabs/aws-lambda-web-adapter)
project to adapt regular HTTP servers, like Deno's `Deno.serve`, to the AWS
Lambda runtime API.

We also use the `denoland/deno:bin-1.45.2` image to get the Deno binary and
`debian:bookworm-20230703-slim` as the base image. The
`debian:bookworm-20230703-slim` image is used to keep the image size small.

The `PORT` environment variable is set to `8000` to tell the AWS Lambda adapter
that we are listening on port `8000`.

We set the `DENO_DIR` environment variable to `/var/deno_dir` to store cached
Deno source code and transpiled modules in the `/var/deno_dir` directory.

The warmup caches step is used to warm up the Deno cache before the function is
invoked. This is done to reduce the cold start time of the function. These
caches contain the compiled code and dependencies of your function code. This
step starts your server for 10 seconds and then exits.

When using a package.json, remember to run `deno install` to install
`node_modules` from your `package.json` file before warming up the caches or
running the function.

## Step 3: Build the Docker Image

Build the Docker image using the following command:

```bash
docker build -t hello-world .
```

## Step 4: Create an ECR Docker repository and push the image

With the AWS CLI, create an ECR repository and push the Docker image to it:

```bash
aws ecr create-repository --repository-name hello-world --region us-east-1 | grep repositoryUri
```

This should output a repository URI that looks like
`<account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world`.

Authenticate Docker with ECR, using the repository URI from the previous step:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com
```

Tag the Docker image with the repository URI, again using the repository URI
from the previous steps:

```bash
docker tag hello-world:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

Finally, push the Docker image to the ECR repository, using the repository URI
from the previous steps:

```bash
docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

## Step 5: Create an AWS Lambda function

Now you can create a new AWS Lambda function from the AWS Management Console.

1. Go to the AWS Management Console and
   [navigate to the Lambda service](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1).
2. Click on the "Create function" button.
3. Choose "Container image".
4. Enter a name for the function, like "hello-world".
5. Click on the "Browse images" button and select the image you pushed to ECR.
6. Click on the "Create function" button.
7. Wait for the function to be created.
8. In the "Configuration" tab, go to the "Function URL" section and click on
   "Create function URL".
9. Choose "NONE" for the auth type (this will make the lambda function publicly
   accessible).
10. Click on the "Save" button.

## Step 6: Test the Lambda function

You can now visit your Lambda function's URL to see the response from your Deno
app.

🦕 You have successfully deployed a Deno app to AWS Lambda using Docker. You can
now use this setup to deploy more complex Deno apps to AWS Lambda.
