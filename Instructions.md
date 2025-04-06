### Step-by-Step Instructions

1. **Clone the Repository**

   - Open your terminal and run:
     ```bash
     git clone https://github.com/skarthikeyan96/issue-labeler.git
     cd issue-labeler
     ```
   - This downloads the project to your local machine.

2. **Install Dependencies**

   - Ensure Node.js is installed (`node -v` to check).
   - Install project dependencies using Yarn:
     ```bash
     yarn install
     ```
   - This sets up Node modules like Express and Octokit.

3. **Set Up Environment Variables**

   - Create a `.env` file in the project root:
     ```bash
     touch .env
     ```
   - Add the following, replacing placeholders with your values:
     ```
     GITHUB_TOKEN=your-github-personal-access-token
     WEBHOOK_SECRET=my-secret-token
     ```
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token with repo scope (required for Pulumi and Octokit).
   - `WEBHOOK_SECRET`: A secret token (e.g., `my-secret-token`) for webhook security (optional but recommended).

4. **Configure Pulumi and Run `pulumi up`**

   - Initialize a Pulumi project if not already set up:
     ```bash
     pulumi stack init dev
     ```
   - Log in to Pulumi if not already authenticated:
     ```bash
     pulumi login
     ```
   - **Run `pulumi up` to create GitHub labels**: This critical step deploys the labels (`bug`, `enhancement`, `question`) defined in the Pulumi code to your repository:
     ```bash
     pulumi up
     ```
   - Follow the CLI prompts to preview and confirm the deployment. This ensures your repo has the necessary labels for the auto-labeler.
   - **Important**: Update the `owner` and `repoName` variables in `index.ts` to match your GitHub username and repository name if you fork or use a different repo. For example:
     ```typescript
     const owner = "your-username";
     const repoName = "your-repo-name";
     ```

5. **Start the Server**

   - Build and run the application:
     ```bash
     yarn build
     yarn start
     ```
   - The server will start on `http://localhost:3000`. Keep it running.

6. **Expose Locally with ngrok**

   - Install ngrok if not installed, then run:
     ```bash
     ngrok http 3000
     ```
   - Copy the public URL provided (e.g., `https://abcdef123.ngrok.io`).

7. **Set Up GitHub Webhook**

   - Go to your GitHub repository: `https://github.com/<your-username>/<your-repo>/settings/hooks`.
   - Click “Add webhook”.
   - Payload URL: Use the ngrok URL with `/webhook` (e.g., `https://abcdef123.ngrok.io/webhook`).
   - Content type: `application/json`.
   - Secret: Enter `my-secret-token` (matches `.env`).
   - Events: Select “Let me select individual events” and check “Issues”.
   - Save the webhook. GitHub will ping it to verify.

8. **Test the Setup**

   - Create a new issue in your repository (e.g., title: “Test bug”, body: “This is a bug report”).
   - Verify the `bug` label is applied automatically.
   - Check for a comment: “Thanks for your contribution! Please review our guidelines at CONTRIBUTING.md.”
   - Note: Stale issue closing will activate after 30 days of inactivity (testable with an old issue or manual workflow trigger via GitHub Actions).

9. **Customize (Optional)**
   - Edit `config.json` to add your own keyword-to-label mappings:
     ```json
     {
       "bug": "bug",
       "feature": "enhancement",
       "question": "question",
       "error": "bug"
     }
     ```
   - Ensure corresponding labels exist (via `pulumi up` or GitHub UI). Rerun `pulumi up` if adding new labels.

```

```
