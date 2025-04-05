Automatically label issues based on keywords in the title/description.

Assign reviewers to PRs based on the modified files.

Auto-close stale issues after a certain period of inactivity.

Post friendly comments to remind contributors about contribution guidelines.

# GitHub Issue Auto-Labeler

## Overview

A Pulumi-based tool to automatically label GitHub issues based on keywords in titles and bodies, using a configurable `config.json` file.

## Features

- Real-time labeling via GitHub webhooks.
- Labels based on issue title or body content.
- Customizable rules via `config.json`.

## Installation

1. Install Node.js and Pulumi CLI.
2. Clone the repo: `git clone https://github.com/skarthikeyan96/issue-labeler-test.git`
3. Install dependencies: `yarn install`
4. Set environment variables: `export GITHUB_TOKEN=<your-token>`

## Usage

1. Run `pulumi up` to set up labels.
2. Start the server: `yarn build && yarn start`
3. Set up a webhook in GitHub:
   - URL: `https://<ngrok-url>/webhook`
   - Content type: `application/json`
   - Secret: `my-secret-token` (optional, for security).

## Screenshots

![Labeled Issue #12](path-to-issue-12-screenshot.png)

## Troubleshooting

- **404 Error**: Verify `ngrok` URL and webhook path.
- **401 Error**: Ensure `WEBHOOK_SECRET` matches GitHub settings.
- **Label Missing**: Add new labels via Pulumi or GitHub UI.
