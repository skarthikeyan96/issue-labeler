"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const pulumi = require("@pulumi/pulumi");
const octokit = require("@octokit/rest");
const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
// Config
const repoName = "issue-labeler";
const owner = "skarthikeyan96";
const webhookSecret = process.env.WEBHOOK_SECRET || "my-secret-token";
// Initialize Octokit
const githubToken = process.env.GITHUB_TOKEN;
if (!githubToken) {
    throw new Error("Missing GITHUB_TOKEN");
}
const client = new octokit.Octokit({ auth: githubToken });
// Load label rules from config.json
const labelRules = JSON.parse(fs.readFileSync("config.json", "utf8"));
// Function to label a single issue
async function labelIssue(issue) {
    const title = issue.title.toLowerCase();
    const body = issue.body ? issue.body.toLowerCase() : "";
    let labelToAdd = "c5"; // Default label
    for (const [keyword, label] of Object.entries(labelRules)) {
        if (title.includes(keyword) || body.includes(keyword)) {
            labelToAdd = label;
            break;
        }
    }
    console.log(`Labeling issue #${issue.number} with ${labelToAdd}`);
    try {
        await client.issues.addLabels({
            owner,
            repo: repoName,
            issue_number: issue.number,
            labels: [labelToAdd],
        });
        console.log(`Successfully labeled issue #${issue.number}`);
    }
    catch (err) {
        console.error(`Failed to label issue #${issue.number}:`, err);
    }
}
// Function to label all open issues
async function labelIssues() {
    const { data: issues } = await client.issues.listForRepo({
        owner,
        repo: repoName,
        state: "open",
    });
    console.log(`Found ${issues.length} issues`);
    for (const issue of issues) {
        await labelIssue(issue);
    }
}
// Set up Express server for webhooks
const app = express();
// Log all incoming requests
app.use((req, res, next) => {
    next();
});
// Use express.json() to parse the body
app.use(express.json());
// Basic route to test that the server is working
app.get("/health", (req, res) => {
    res.status(200).send("Working");
});
app.use(express.json({
    verify: (req, res, buf) => {
        console.log("Entering verify function");
        const signature = req.headers["x-hub-signature-256"];
        if (!signature)
            throw new Error("No signature provided");
        const hmac = crypto.createHmac("sha256", webhookSecret);
        const digest = "sha256=" + hmac.update(buf).digest("hex");
        if (signature !== digest)
            throw new Error("Invalid signature");
        console.log("Signature validated successfully");
    }
}));
// Webhook endpoint
app.post("/webhook", async (req, res) => {
    console.log("Inside /webhook endpoint");
    console.log("Parsed body:", req.body);
    const event = req.headers["x-github-event"];
    if (event === "issues" && req.body.action === "opened") {
        console.log("New issue created, labeling...");
        const issue = req.body.issue;
        await labelIssue(issue);
        await client.issues.createComment({
            owner,
            repo: repoName,
            issue_number: issue.number,
            body: "Thanks for your contribution! Please review our guidelines at [CONTRIBUTING.md](https://github.com/skarthikeyan96/issue-labeler/blob/main/CONTRIBUTING.md)."
        });
        console.log(`Posted comment on issue #${issue.number}`);
    }
    res.status(200).send("Webhook received");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error handling middleware:", err.message);
    res.status(500).send("Internal Server Error");
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// Export for `pulumi up` (static setup)
exports.status = pulumi.interpolate `Labeler setup for ${repoName}!`;
//# sourceMappingURL=index.js.map