---
last_modified: 2026-06-18
title: "Deploy Deno to AWS ECS Fargate"
description: "Step-by-step tutorial on deploying a Deno app to AWS ECS Fargate. Learn how to containerize a Deno app, push the image to Amazon ECR, and run it as a serverless Fargate service behind a load balancer."
url: /examples/aws_ecs_fargate_tutorial/
---

[AWS Fargate](https://aws.amazon.com/fargate/) is a serverless compute engine
for containers that works with Amazon Elastic Container Service (ECS). You
package your app as a container image, hand ECS a task definition, and Fargate
provisions and scales the underlying compute for you, so there are no EC2
instances to manage.

This tutorial walks through containerizing a Deno app, pushing the image to
[Amazon ECR](https://aws.amazon.com/ecr/), and running it as a Fargate service.

Before continuing, make sure you have:

- the [`docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- the
  [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html),
  authenticated with an account that can manage ECR and ECS
- an [AWS account](https://aws.amazon.com/)

## Create the app and Dockerfile

To keep the focus on deployment, our app is a single `main.ts` that serves an
HTTP response:

```ts title="main.ts"
Deno.serve({ port: 8000 }, () => new Response("Hello from Deno on Fargate!"));
```

Next to it, add a `Dockerfile`:

```Dockerfile title="Dockerfile"
FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["run", "--allow-net", "main.ts"]
```

Test it locally before deploying:

```shell
docker build -t deno-fargate .
docker run -p 8000:8000 deno-fargate
```

Visit `localhost:8000` and you should see the response. Fargate requires
`linux/amd64` images unless you create an ARM task, so if you are on an Apple
Silicon machine build for that platform when you push:

```shell
docker build --platform linux/amd64 -t deno-fargate .
```

## Push the image to Amazon ECR

Set a couple of shell variables for convenience, replacing the values with your
account ID and preferred region:

```shell
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1
export REPO=deno-fargate
```

Create an ECR repository to hold the image:

```shell
aws ecr create-repository --repository-name $REPO --region $AWS_REGION
```

Authenticate Docker with ECR, then tag and push the image:

```shell
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin \
    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker tag deno-fargate \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
```

## Create a task definition

A
[task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
tells ECS how to run your container: which image, how much CPU and memory, and
which ports to expose. Save the following as `task-definition.json`,
substituting your account ID and region:

```json title="task-definition.json"
{
  "family": "deno-fargate",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "deno-fargate",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/deno-fargate:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

The `executionRoleArn` refers to the `ecsTaskExecutionRole`, which lets ECS pull
images from ECR and write logs to CloudWatch. If you have not used ECS before,
create it once by following
[the AWS guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html).

Register the task definition:

```shell
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region $AWS_REGION
```

## Run it as a Fargate service

Create a cluster to hold the service:

```shell
aws ecs create-cluster --cluster-name deno-cluster --region $AWS_REGION
```

Now create a service that keeps one copy of the task running. Fargate needs to
know which subnets and security group to launch into, and `assignPublicIp` lets
the task pull the image and be reachable without a NAT gateway. Replace the
subnet and security group IDs with ones from your VPC, and make sure the
security group allows inbound traffic on port `8000`:

```shell
aws ecs create-service \
  --cluster deno-cluster \
  --service-name deno-fargate \
  --task-definition deno-fargate \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc123],securityGroups=[sg-abc123],assignPublicIp=ENABLED}" \
  --region $AWS_REGION
```

Once the service reaches a steady state, find the task's public IP:

```shell
TASK_ARN=$(aws ecs list-tasks --cluster deno-cluster \
  --service-name deno-fargate --query "taskArns[0]" --output text --region $AWS_REGION)

ENI_ID=$(aws ecs describe-tasks --cluster deno-cluster --tasks $TASK_ARN \
  --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" \
  --output text --region $AWS_REGION)

aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID \
  --query "NetworkInterfaces[0].Association.PublicIp" --output text --region $AWS_REGION
```

Open `http://<public-ip>:8000` and you should see your Deno app responding from
Fargate.

## Production considerations

For anything beyond a demo, put the service behind an
[Application Load Balancer](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html)
instead of exposing the task's public IP directly. The load balancer gives you a
stable DNS name, TLS termination, and health checks, and it lets ECS roll new
deployments without downtime. You can also raise `desired-count` to run multiple
tasks and enable
[service auto scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
to adjust capacity based on load.

🦕 Now you can deploy a Deno app to AWS ECS Fargate by containerizing it,
pushing the image to Amazon ECR, and running it as a Fargate service.
