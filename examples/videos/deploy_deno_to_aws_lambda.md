---
title: "Deploy Deno to AWS Lambda"
url: /examples/deploy_deno_to_aws_lambda/
videoUrl: https://www.youtube.com/watch?v=_xLOrT3cWK4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=17
layout: video.tsx
---

## Description of video

Show how to deploy Deno applications to AWS Lambda (using a community runtime
for Lambda).

## Transcript and code

### Run Deno on AWS Lambda

Running Deno on AWS Lambda? Sure, you can do that. With AWS lambda the
serverless pricing can be cheaper than a VPS and can be easier to maintain
because it can auto scale behind the scenes.

<!-- We have our tree app here, and we want to host it on AWS.  -->

To make that work, we’re going to use the aws-lambda-adapter project to make
sure that our `Deno.serve` function runs as we expect it to. This is a popular
approach to deploying to AWS lambda due to control, flexibility, and
consistency.

There’s a nice article on this on the blog if you want to learn more about these
considerations.

Let’s take a look at the Dockerfile that we can use to make this work:

```dockerfile
# Set up the base image
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 AS aws-lambda-adapter
FROM denoland/deno:bin-2.0.2 AS deno_bin
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
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "-A", "main.ts"]
```

Then we’ll build the Docker image.

```shell
docker build -t my-deno-project .
```

Now we need to start interfacing with AWS. If this is your first time working
with AWS, you can create an account:
[https://aws.amazon.com](https://aws.amazon.com)

And if you haven’t installed the AWS CLI, you can do that too. You know if it’s
installed by typing `aws` into your Terminal or Command Prompt. If that returns
an error you can install with homebrew or follow the instructions through the
website:
[https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```
brew install awscli
```

Then you’ll want to make sure that you’re set up with `aws configure`.
Everything that it is looking for is in the
[Security Credentials section of the
AWS Console](https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories).

### Use the CLI to create an ECR

The ECR is a registry service where we can push our docker container

```
aws ecr create-repository --repository-name my-deno-project --region us-east-1 | grep repositoryUri
```

This outputs a URI for the repo: \`"repositoryUri":
"\<\<myuserid\>\>[.dkr.ecr.us-west-1.amazonaws.com/my-deno-project](http://.dkr.ecr.us-west-1.amazonaws.com/my-deno-project)",\`

Then log in using the URI that comes back

```shell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <username>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project
```

Tag the image

```shell
docker tag my-deno-project:latest <myProject>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project:latest
```

Then Push the image to ECR

```shell
docker push <myproject>.dkr.ecr.us-west-1.amazonaws.com/my-deno-project:latest
```

Now we need to create a function that will host our app:

- [https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1\#/begin](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/begin)
- Think of a function as being a place where the app is going to run
- Select Create a Function
- Select Container Image Radio Button
- Call the function `tree-app`
- Select the app from the Browse Containers button
- Halfway down the page select “Configuration”
- Select `Function URL`
- Create a URL
- Select None so the endpoint is public
- Select Save
- Check the app in the browser

One thing to keep in mind with Lambda functions is cold start performance. Cold
starts happen when AWS needs to initialize your function, and it can cause
slight delays. There’s a pretty cool
[blog here that goes through Deno vs. other
tools](https://deno.com/blog/aws-lambda-coldstart-benchmarks).

Using Deno with AWS Lambda functions is a great way to stand up your app quickly
in a familiar environment.
