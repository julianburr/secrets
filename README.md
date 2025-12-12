# secrets

This CLI tool helps you pull secrets (e.g., for local .env files) from whatever vault service your team uses. Instead of having to ask for all the env files for local development, new developers only need to get access to that vault provider, and everything works from the get-go.

To do so, the script will replace any environment variables that start with `secret://*` or `psst://*` with the actual secret value retrieved from the provider.

## Installation

```bash
npm install @julianburr/secrets
# or
yarn add @julianburr/secrets
# or
pnpm add @julianburr/secrets
```

To see all available commands and options you can run:

```bash
secrets --help
# or
psst --help
```

## Usage

The CLI tool provides several commands:

### Reading a Secret

```bash
# Retrieve a specific secret
secrets read <key>

# Write the secret value to a file
secrets read <key> -o output.txt
```

### Injecting Secrets into a File

```bash
# Inject secrets into a file based on template, e.g. in CI/CD
secrets inject -i .env.template -o .env
```

### Running a Command with Secrets in Environment

```bash
# Run a command with secrets injected into environment
secrets run -- <your-command>

# Use a file containing secret references
secrets run -i .env.special -- <your-command>
```

### See all commands and options

```bash
secrets --help
```

## Providers

The following secret providers are available:

### AWS Parameter Store

Uses AWS Systems Manager Parameter Store to retrieve secrets.

**Environment Variables:**

- `AWS_PROFILE`: AWS credentials should be configured via the standard AWS SDK methods (e.g., `~/.aws/credentials`, environment variables, etc.)
- `AWS_REGION` - (Optional) The AWS region to use

**Key Format:**

- Parameter name as defined in Parameter Store (e.g., `/my-app/dev/db-password`)

### AWS Secrets Manager

**Environment Variables:**

- `AWS_PROFILE`: AWS credentials should be configured via the standard AWS SDK methods (e.g., `~/.aws/credentials`, environment variables, etc.)
- `AWS_REGION`: (optional) The AWS region to use

**Key Format:**

- `[secret]`: Secret name or ARN as defined in Secrets Manager

### AWS Parameter Store

**Environment Variables:**

- `AWS_PROFILE`: AWS credentials should be configured via the standard AWS SDK methods (e.g., `~/.aws/credentials`, environment variables, etc.)
- `AWS_REGION`: (optional) The AWS region to use

**Key Format:**

- `[secret]`: path of parameter store item

### GCP Secret Manager

**Environment Variables:**

- `GOOGLE_APPLICATION_CREDENTIALS`: should be configured via the standard GCP SDK methods
- `GCP_PROJECT_ID`: project UUID

**Key Format:**

- `[project]/[name]`
  - `[project]`: project slug
  - `[name]`: secret name within that project
- `[project]/[name]:v[version]`
  - `[version]`: (optional) the version of the given secret

### 1Password

**Environment Variables:**

- `OP_CONNECT_SERVER`: URL of the 1Password Connect API server
- `OP_CONNECT_TOKEN`: API token for 1Password Connect

**Key Format:**

- `[vault].[item].[name?]`
  - `[vault]`: vault UUID or name
  - `[item]`: item UUID or name within that vault
  - `[name]`: (optional) field name within the item, default to the password field if not specified

## Config

This project uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig), so you can use any of the support file naming conventions for your config file (e.g. `.secrets`, `secrets.json`, etc. or as a `secrets` property in your `package.json`). Alternatively you can also use `psst` as your config (e.g. `.psst`, `psst.json`, etc.)

**Available options:**

- `provider`
  - `"1password" | "aws-parameter-store" | "aws-secrets-manager" | "gcp-secrets-manager"`: string name of provider to use for secret value retrieval

## Contribute

```bash
# Install dependencies
pnpm install

# Run linter and typecheck
pnpm lint
pnpm typecheck
```
