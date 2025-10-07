---
title: Cloud Connections
description: Learn how to connect Deno Deploy to cloud providers like AWS and Google Cloud Platform without needing to manage credentials.
oldUrl: /deploy/reference/cloud-connections
---

Deno Deploy allows you to connect to cloud providers like AWS and Google Cloud
Platform (GCP) without needing to manually manage static credentials. This is
done through the use of OpenID Connect (OIDC) and identity federation.

## How it works

Deno Deploy is an OIDC provider. Every running application of Deno Deploy can be
issued short-lived JWT tokens that are signed by Deno Deploy. These tokens
contain information about the application, such as the organization and
application ids and slugs, the context in which an application is executing, and
the running revision ID. Learn more about
[OIDC in Deno Deploy](/deploy/reference/oidc).

By sending these tokens to AWS or GCP, one can exchange them for short-lived AWS
or GCP credentials that can be used to access cloud resources such as AWS S3
buckets or Google Cloud Spanner instances. When sending the token to AWS or GCP,
the token is verified by the cloud provider, which checks that it was issued by
Deno Deploy and that it is valid for the application and context that should be
allowed to access the cloud resources.

To enable AWS or GCP to exchange OIDC tokens for credentials, the cloud provider
needs to be configured to trust Deno Deploy as an OIDC identity provider, and an
AWS IAM role or GCP service account needs to be created that allows the exchange
of tokens for credentials, for a specific Deno Deploy application.

## Setting up AWS

This guide contains three guides for setting up these AWS resources. You can use
any of these to set up the AWS resources.

- [Using the `deno deploy setup-aws` command from your local machine](#aws%3A-easy-setup-with-deno-deploy-setup-aws)
  (recommended)
- [Using the `aws` CLI](#setup-aws-cli)
- [Using the AWS Console](#setup-aws-console)
- [Using Terraform](#setup-aws-terraform)

To set up AWS with Deno Deploy, the following resources need to be created
inside of your AWS account:

- An
  [AWS IAM OIDC Identity Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
  that trusts Deno Deploy as an OIDC provider.
  - The OIDC provider URL is `https://oidc.deno.com`.
  - The audience (client ID) is `sts.amazonaws.com`.
- An
  [AWS IAM Role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html)
  that can be "assumed" (signed into) using a Deno Deploy OIDC token.
  - The trust policy of the role should allow the OIDC provider to assume the
    role, such as:
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Federated": "arn:aws:iam::<account-id>:oidc-provider/oidc.deno.com"
          },
          "Action": "sts:AssumeRoleWithWebIdentity",
          "Condition": {
            "StringEquals": {
              "oidc.deno.com:aud": "sts.amazonaws.com",
              "oidc.deno.com:sub": "deployment:<organization-slug>/<application-slug>/<context-name>"
            }
          }
        }
      ]
    }
    ```
  - The role should have permissions to access the AWS resources you want to
    use, such as S3 buckets or DynamoDB tables.

After setting up the AWS resources, navigate to the AWS cloud integration setup
page from the app settings. There you must select the context(s) in which the
cloud connection should be available.

Then you must enter the ARN (Amazon Resource Name) for the AWS IAM Role created
earlier. After entering the ARN you can start a connection test by pressing the
"Test connection" button. The connection test will check that the AWS IAM Role
and OIDC provider are configured correctly, and does not allow access from apps,
orgs, or contexts that should not have access.

After testing the connection, you can save the cloud connection.

### Usage

After setting up a cloud connection between AWS and Deno Deploy you can access
AWS resources such as S3 directly from your application code, without having to
configure any credentials.

The AWS SDK v3 automatically picks up on the cloud connection configuration.
Here is an example of accessing an S3 bucket from a Deno Deploy application with
a configured AWS account.

```ts
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-2" });

Deno.serve(() => {
  const { Buckets } = await s3.send(new ListBucketsCommand({}));
  return Response.json(Buckets);
});
```

## Setting up GCP

To set up GCP with Deno Deploy, the following resources need to be created
inside of your GCP account:

- A
  [Workload Identity Pool and Workload Identity Provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers)
  that trusts Deno Deploy as an OIDC provider.
  - The OIDC provider URL is `https://oidc.deno.com`.
  - The audience should be the default (starts with
    `https://iam.googleapis.com`).
  - At least the following attribute mappings must be set:
    - `google.subject = assertion.sub`
    - `attribute.full_slug = assertion.org_slug + "/" + assertion.app_slug`
- A [Service account](https://cloud.google.com/iam/docs/service-accounts-create)
  that can be "impersonated" (signed into) using the OIDC token.
  - A principal or principal set from the workload identity pool should have
    access to the service account using the Workload Identity User role
    (`roles/iam.workloadIdentityUser`). Examples:
    - A specific context in an app:
      `principal://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:<ORG_SLUG>/<APP_SLUG>/<CONTEXT_NAME>`
    - All contexts in an app:
      `principalSet://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/<ORG_SLUG>/<APP_SLUG>`
  - The service account should have access to the GCP resources you want to use,
    such as a Google Cloud Storage bucket.

This guide contains three guides for setting up these GCP resources. You can use
any of these to set up the GCP resources.

- [Using the `deno deploy setup-gcp` command from your local machine](#setup-gcp-easy)
  (recommended)
- [Using the `gcloud` CLI](#setup-gcp-cli)
- [Using the GCP Console](#setup-gcp-console)
- [Using Terraform](#setup-gcp-terraform)

After setting up the GCP resources, navigate to the GCP cloud integration setup
page from the app settings. There you must select the context(s) in which the
cloud connection should be available.

Then you must enter the workload identity provider ID, in the form
`projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/providers/oidc-deno-com`,
and the email address of the GCP Service Account created earlier. After entering
the email address you can start a connection test by pressing the "Test
connection" button. The connection test will check that the GCP Service Account
and OIDC provider are configured correctly, and does not allow access from apps,
orgs, or contexts that should not have access.

After testing the connection, you can save the cloud connection.

### Usage

After setting up a cloud connection between GCP and Deno Deploy you can access
GCP resources such as Cloud Storage directly from your application code, without
having to configure any credentials.

The Google Cloud SDK automatically picks up on the cloud connection
configuration. Here is an example of accessing a Cloud Storage bucket from a
Deno Deploy application with a configured GCP account.

```ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

Deno.serve(() => {
  const [buckets] = await storage.getBuckets();
  return Response.json(buckets);
});
```

## Removing a cloud integration

You can remove a cloud connection by pressing the "Delete" button in the cloud
integration section, next to a specific cloud connection.

## Setup Guides

### AWS: Easy setup with `deno deploy setup-aws`

For instructions on how to set up AWS with Deno Deploy using the
`deno deploy setup-aws` command, please see the instructions on the AWS cloud
integration setup page in your app settings.

### AWS: Using the `aws` CLI

You can manually set up AWS resources using the AWS CLI. This requires having
the AWS CLI installed and configured with appropriate permissions to create IAM
roles, OIDC providers, and attach policies.

#### Prerequisites

- AWS CLI installed and configured
- Permissions to create IAM roles, OIDC providers, and attach policies

#### Step 1: Create OIDC Provider

First, create the OIDC provider if it doesn't already exist:

```bash
aws iam create-open-id-connect-provider \
  --url https://oidc.deno.com \
  --client-id-list sts.amazonaws.com
```

#### Step 2: Create IAM Role with Trust Policy

Create a trust policy file that allows your Deno Deploy application to assume
the role. You can choose between allowing access to all contexts or specific
contexts only.

**For all contexts in your app:**

```bash
# Create trust policy file for entire app
cat > trust-policy-all-contexts.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/oidc.deno.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "oidc.deno.com:sub": "deployment:YOUR_ORG/YOUR_APP/*"
        }
      }
    }
  ]
}
EOF
```

**For specific contexts only:**

```bash
# Create trust policy file for specific contexts
cat > trust-policy-specific-contexts.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/oidc.deno.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.deno.com:sub": [
            "deployment:YOUR_ORG/YOUR_APP/production",
            "deployment:YOUR_ORG/YOUR_APP/staging"
          ]
        }
      }
    }
  ]
}
EOF
```

#### Step 3: Create the IAM Role

Create the role using the appropriate trust policy:

```bash
# For entire app
aws iam create-role \
  --role-name DenoDeploy-YourOrg-YourApp \
  --assume-role-policy-document file://trust-policy-all-contexts.json

# OR for specific contexts
aws iam create-role \
  --role-name DenoDeploy-YourOrg-YourApp \
  --assume-role-policy-document file://trust-policy-specific-contexts.json
```

#### Step 4: Attach Policies

Attach the necessary policies to grant permissions for the AWS resources your
application needs:

```bash
aws iam attach-role-policy \
  --role-name DenoDeploy-YourOrg-YourApp \
  --policy-arn arn:aws:iam::aws:policy/POLICY_NAME
```

Replace `POLICY_NAME` with the appropriate AWS policies (e.g.,
`AmazonS3ReadOnlyAccess`, `AmazonDynamoDBReadOnlyAccess`, etc.) based on your
requirements.

After completing these steps, use the Role ARN in your Deno Deploy cloud
connection configuration.

### AWS: Using the AWS Console

You can set up AWS resources using the AWS Management Console web interface.
This method provides a visual way to configure the necessary IAM resources.

#### Step 1: Create OIDC Identity Provider

1. **Navigate to IAM Console** → Identity providers
2. **Create OIDC Provider**:
   - Click "Add provider"
   - Select "OpenID Connect"
   - Provider URL: `https://oidc.deno.com`
   - Audience: `sts.amazonaws.com`
   - Click "Add provider"

#### Step 2: Create IAM Role

1. **Navigate to IAM Console** → Roles
2. **Create role**:
   - Click "Create role"
   - Trusted entity type: **Web identity**
   - Identity provider: Select the created OIDC provider (`oidc.deno.com`)
   - Audience: `sts.amazonaws.com`

#### Step 3: Configure Trust Policy Conditions

Add a condition to restrict which Deno Deploy applications can assume this role.
Choose one approach:

**For all contexts in your app:**

- Condition key: `oidc.deno.com:sub`
- Operator: `StringLike`
- Value: `deployment:YOUR_ORG/YOUR_APP/*`

**For specific contexts only:**

- Condition key: `oidc.deno.com:sub`
- Operator: `StringEquals`
- Value: `deployment:YOUR_ORG/YOUR_APP/production`
- Add additional conditions for each context (e.g., staging, development)

Click "Next" to continue.

#### Step 4: Attach Permissions Policies

1. Search and select appropriate policies based on your needs:
   - For S3 access: `AmazonS3ReadOnlyAccess` or `AmazonS3FullAccess`
   - For DynamoDB access: `AmazonDynamoDBReadOnlyAccess` or
     `AmazonDynamoDBFullAccess`
   - For other services: Select relevant policies
2. Click "Next"

#### Step 5: Name and Create Role

1. **Role name**: `DenoDeploy-YourOrg-YourApp` (replace with your actual
   organization and app names)
2. **Description**: Optional description of the role's purpose
3. Review the trust policy and permissions
4. Click "Create role"

#### Step 6: Copy Role ARN

After creating the role:

1. Go to the role details page
2. Copy the Role ARN (it looks like
   `arn:aws:iam::123456789012:role/DenoDeploy-YourOrg-YourApp`)
3. Use this ARN in your Deno Deploy cloud connection configuration

### AWS: Using Terraform

You can use Terraform to programmatically create the AWS resources needed for
cloud connections. This approach is ideal for infrastructure-as-code workflows.

#### Terraform Configuration

Create a Terraform configuration file with the following content:

```hcl
# Variables
variable "org" {
  description = "Deno Deploy organization name"
  type        = string
}

variable "app" {
  description = "Deno Deploy app name"
  type        = string
}

variable "contexts" {
  description = "List of specific contexts to allow (leave empty for all contexts)"
  type        = list(string)
  default     = []
}

# OIDC Provider
resource "aws_iam_openid_connect_provider" "deno_deploy" {
  url = "https://oidc.deno.com"
  client_id_list = ["sts.amazonaws.com"]
}

# IAM Role with dynamic trust policy based on contexts
resource "aws_iam_role" "deno_deploy_role" {
  name = "DenoDeploy-${var.org}-${var.app}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.deno_deploy.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = length(var.contexts) > 0 ? {
          # Specific contexts only
          StringEquals = {
            "oidc.deno.com:sub" = [
              for context in var.contexts : "deployment:${var.org}/${var.app}/${context}"
            ]
          }
        } : {
          # All contexts (wildcard)
          StringLike = {
            "oidc.deno.com:sub" = "deployment:${var.org}/${var.app}/*"
          }
        }
      }
    ]
  })
}

# Attach policies
resource "aws_iam_role_policy_attachment" "example" {
  role       = aws_iam_role.deno_deploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/POLICY_NAME"
}

# Output the role ARN
output "role_arn" {
  value = aws_iam_role.deno_deploy_role.arn
}
```

#### Usage Examples

**For entire app access (all contexts):**

```hcl
module "deno_deploy_aws" {
  source = "./path-to-terraform-module"

  org      = "your-org"
  app      = "your-app"
  contexts = []  # Empty list allows all contexts
}
```

**For specific contexts only:**

```hcl
module "deno_deploy_aws" {
  source = "./path-to-terraform-module"

  org      = "your-org"
  app      = "your-app"
  contexts = ["production", "staging"]
}
```

#### Applying the Configuration

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Plan the deployment:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

After applying, Terraform will output the Role ARN that you can use in your Deno
Deploy cloud connection configuration.

#### Customizing Policies

Replace `POLICY_NAME` in the `aws_iam_role_policy_attachment` resource with the
appropriate AWS managed policies or create custom policies based on your
requirements. You can add multiple policy attachments by creating additional
`aws_iam_role_policy_attachment` resources.

### GCP: Easy setup with `deno deploy setup-gcp`

For instructions on how to set up GCP with Deno Deploy using the
`deno deploy setup-gcp` command, please see the instructions on the Google cloud
integration setup page in your app settings.

### GCP: Using the `gcloud` CLI

You can manually set up GCP resources using the gcloud CLI. This requires having
the gcloud CLI installed and authenticated with appropriate permissions to
create workload identity pools, service accounts, and grant IAM roles.

#### Prerequisites

- gcloud CLI installed and authenticated
- Access to create workload identity pools, service accounts, and grant IAM
  roles
- Required APIs enabled:
  - `iam.googleapis.com`
  - `iamcredentials.googleapis.com`
  - `sts.googleapis.com`

#### Step 1: Enable Required APIs

First, enable the required APIs for your project:

```bash
gcloud services enable iam.googleapis.com
gcloud services enable iamcredentials.googleapis.com
gcloud services enable sts.googleapis.com
```

#### Step 2: Create Workload Identity Pool

Create a workload identity pool to manage external identities:

```bash
gcloud iam workload-identity-pools create oidc-deno-com \
  --location=global \
  --display-name="Deno Deploy Workload Identity Pool"
```

#### Step 3: Create Workload Identity Provider

Configure the OIDC provider within the workload identity pool:

```bash
gcloud iam workload-identity-pools providers create-oidc oidc-deno-com \
  --workload-identity-pool=oidc-deno-com \
  --location=global \
  --issuer-uri=https://oidc.deno.com \
  --attribute-mapping="google.subject=assertion.sub,attribute.org_slug=assertion.org_slug,attribute.app_slug=assertion.app_slug,attribute.full_slug=assertion.org_slug+\"/\"+assertion.app_slug"
```

#### Step 4: Create Service Account

Create a service account that will be used by your Deno Deploy application:

```bash
gcloud iam service-accounts create deno-your-org-your-app \
  --display-name="Deno Deploy YourOrg/YourApp"
```

#### Step 5: Configure Workload Identity Binding

Get your project number and configure the workload identity binding. Choose
between allowing access to all contexts or specific contexts only.

```bash
# Get project number
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")
```

**For all contexts in your app:**

```bash
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/YOUR_ORG/YOUR_APP"
```

**For specific contexts only:**

```bash
# Bind for production context
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/production"

# Bind for staging context
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/staging"

# Add more bindings for each specific context as needed
```

#### Step 6: Grant Roles to Service Account

Grant the necessary roles to the service account for accessing GCP resources:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/ROLE_NAME"
```

Replace `ROLE_NAME` with appropriate roles such as:

- `roles/storage.objectViewer` for Cloud Storage read access
- `roles/storage.objectAdmin` for Cloud Storage full access
- `roles/cloudsql.client` for Cloud SQL access
- Other roles based on your requirements

#### Step 7: Get Required Values

After completing the setup, you'll need two values for your Deno Deploy
configuration:

1. **Workload Provider ID**:
   `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/providers/oidc-deno-com`
2. **Service Account Email**:
   `deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com`

Use these values in your Deno Deploy cloud connection configuration.

### GCP: Using the GCP Console

You can set up GCP resources using the Google Cloud Console web interface. This
method provides a visual way to configure workload identity federation and
service accounts.

#### Step 1: Enable Required APIs

1. **Navigate to APIs & Services** → Library
2. Search for and enable the following APIs:
   - "Identity and Access Management (IAM) API"
   - "IAM Service Account Credentials API"
   - "Security Token Service API"

#### Step 2: Create Workload Identity Pool

1. **Navigate to IAM & Admin** → Workload Identity Federation
2. **Create Pool**:
   - Click "Create Pool"
   - Pool name: `Deno Deploy Workload Id Pool`
   - Pool ID: `oidc-deno-com`
   - Click "Continue"

#### Step 3: Add Provider to Pool

1. **Add a provider**:
   - Click "Add a provider"
   - Provider type: **OpenID Connect (OIDC)**
   - Provider name: `Deno Deploy OIDC Provider`
   - Provider ID: `oidc-deno-com`
   - Issuer URL: `https://oidc.deno.com`

2. **Configure attribute mappings**:
   - `google.subject` → `assertion.sub`
   - `attribute.org_slug` → `assertion.org_slug`
   - `attribute.app_slug` → `assertion.app_slug`
   - `attribute.full_slug` → `assertion.org_slug + "/" + assertion.app_slug`

3. Click "Save"

#### Step 4: Create Service Account

1. **Navigate to IAM & Admin** → Service Accounts
2. **Create Service Account**:
   - Click "Create Service Account"
   - Service account name: `deno-your-org-your-app`
   - Service account ID: `deno-your-org-your-app`
   - Description: `Service account for Deno Deploy project your-org/your-app`
   - Click "Create and Continue"

#### Step 5: Grant Roles to Service Account

1. Select appropriate roles based on your needs:
   - For Cloud Storage: `Storage Object Viewer` or `Storage Admin`
   - For Cloud SQL: `Cloud SQL Client`
   - For other services: Select relevant roles
2. Click "Continue" then "Done"

#### Step 6: Configure Workload Identity Binding

1. **Go back to the created service account**
2. Click on the "Principals with access" tab
3. Click "Grant Access"
4. Configure principals - choose one approach:

   **For all contexts in your app:**
   - New principals:
     `principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/YOUR_ORG/YOUR_APP`

   **For specific contexts only:**
   - New principals:
     `principal://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/production`
   - Repeat for each context (staging, etc.)

5. Role: **Workload Identity User**
6. Click "Save"

#### Step 7: Get Required Values

You'll need two values for your Deno Deploy configuration:

1. **Workload Provider ID**:
   - Navigate back to Workload Identity Federation
   - Click on your pool, then your provider
   - Copy the provider resource name (full path starting with `projects/`)
2. **Service Account Email**: Copy from the service account details page

#### Step 8: Verify Configuration

The final workload identity pool overview should show:

- Your pool with the OIDC provider
- The connected service account
- Proper bindings configured

Use the Service Account Email and Workload Provider ID in your Deno Deploy cloud
connection configuration.

### GCP: Using Terraform

You can use Terraform to programmatically create the GCP resources needed for
cloud connections. This approach is ideal for infrastructure-as-code workflows.

#### Terraform Configuration

Create a Terraform configuration file with the following content:

```hcl
# Variables
variable "org" {
  description = "Deno Deploy organization name"
  type        = string
}

variable "app" {
  description = "Deno Deploy app name"
  type        = string
}

variable "contexts" {
  description = "List of specific contexts to allow (leave empty for all contexts)"
  type        = list(string)
  default     = []
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "roles" {
  description = "List of IAM roles to grant to the service account"
  type        = list(string)
  default     = []
}

# Data source for project information
data "google_project" "project" {
  project_id = var.project_id
}

# Workload Identity Pool
resource "google_iam_workload_identity_pool" "deno_deploy" {
  workload_identity_pool_id = "oidc-deno-com"
  display_name              = "Deno Deploy Workload Id Pool"
}

# Workload Identity Provider
resource "google_iam_workload_identity_pool_provider" "deno_deploy" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id
  workload_identity_pool_provider_id = "oidc-deno-com"
  display_name                       = "Deno Deploy OIDC Provider"

  attribute_mapping = {
    "google.subject"        = "assertion.sub"
    "attribute.org_slug"    = "assertion.org_slug"
    "attribute.app_slug"    = "assertion.app_slug"
    "attribute.full_slug"   = "assertion.org_slug + \"/\" + assertion.app_slug"
  }

  oidc {
    issuer_uri = "https://oidc.deno.com"
  }
}

# Service Account
resource "google_service_account" "deno_deploy" {
  account_id   = "deno-${var.org}-${var.app}"
  display_name = "Deno Deploy ${var.org}/${var.app}"
}

# Workload Identity Binding - dynamic based on contexts
resource "google_service_account_iam_binding" "workload_identity" {
  service_account_id = google_service_account.deno_deploy.name
  role               = "roles/iam.workloadIdentityUser"

  members = length(var.contexts) > 0 ? [
    # Specific contexts only
    for context in var.contexts :
    "principal://iam.googleapis.com/projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/subject/deployment:${var.org}/${var.app}/${context}"
  ] : [
    # All contexts (using attribute mapping)
    "principalSet://iam.googleapis.com/projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/attribute.full_slug/${var.org}/${var.app}"
  ]
}

# Grant roles to service account
resource "google_project_iam_member" "service_account_roles" {
  for_each = toset(var.roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.deno_deploy.email}"
}

# Outputs
output "workload_provider_id" {
  value = "projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/providers/${google_iam_workload_identity_pool_provider.deno_deploy.workload_identity_pool_provider_id}"
}

output "service_account_email" {
  value = google_service_account.deno_deploy.email
}
```

#### Usage Examples

**For entire app access (all contexts):**

```hcl
module "deno_deploy_gcp" {
  source = "./path-to-terraform-module"

  org        = "your-org"
  app        = "your-app"
  project_id = "your-gcp-project-id"
  contexts   = []  # Empty list allows all contexts
  roles      = [
    "roles/storage.objectViewer",
    "roles/cloudsql.client"
  ]
}
```

**For specific contexts only:**

```hcl
module "deno_deploy_gcp" {
  source = "./path-to-terraform-module"

  org        = "your-org"
  app        = "your-app"
  project_id = "your-gcp-project-id"
  contexts   = ["production", "staging"]
  roles      = [
    "roles/storage.objectAdmin",
    "roles/cloudsql.client"
  ]
}
```

#### Applying the Configuration

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Plan the deployment:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

After applying, Terraform will output the Workload Provider ID and Service
Account Email that you can use in your Deno Deploy cloud connection
configuration.

#### Customizing Roles

The `roles` variable accepts a list of GCP IAM roles. Common roles include:

- `roles/storage.objectViewer` - Read access to Cloud Storage
- `roles/storage.objectAdmin` - Full access to Cloud Storage objects
- `roles/cloudsql.client` - Access to Cloud SQL instances
- `roles/secretmanager.secretAccessor` - Access to Secret Manager secrets
- Custom roles can also be specified
