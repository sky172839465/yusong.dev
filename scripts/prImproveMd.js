import { execSync } from 'child_process';
import fs from 'fs-extra';
import OpenAI from 'openai';
import { Octokit } from "@octokit/rest";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
const pull_number = parseInt(process.env.PR_NUMBER);

// 1. Get list of changed markdown files in PR
const { data: files } = await octokit.pulls.listFiles({
  owner,
  repo,
  pull_number
});

const mdFiles = files.filter(f => f.filename.endsWith('.md')).map(f => f.filename);
if(mdFiles.length === 0){
  console.log("No markdown files changed.");
  process.exit(0);
}

// 2. Loop through markdown files and improve content
for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf-8');

  const prompt = `Improve the markdown content for clarity, grammar, formatting, and readability:\n\n${content}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  const improved = completion.choices[0].message.content;

  fs.writeFileSync(file, improved, 'utf-8');
  console.log(`Improved ${file}`);
}

// 3. Commit and push changes
execSync('git config user.name "github-actions[bot]"');
execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
execSync('git add .');
execSync(`git commit -m "docs: AI improved markdown files via comment" || echo "docs: No changes to commit"`);
execSync('git push');
execSync('gh pr comment ${{ env.PR_NUMBER }} --body "🤖 docs: AI improved markdown files via comment, commit: $(git rev-parse --short HEAD)."');
