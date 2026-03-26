name: codebase_engineering
description: Use when working on a user's codebase as an engineer—cloning repos, creating branches, making

name: codebase_engineering
description: Use when working on a user's codebase as an engineer—cloning repos, creating branches, making
PRs, debugging, or doing typical software engineering tasks.
Viktor Spaces vs User Codebases
Viktor Spaces ( /work/viktor-spaces/): Apps you build and manage for the user
User codebases ( /work/repos/): The user's own repositories where you act as an engineer
This skill is for the latter—working on existing codebases the user owns.
GitHub Integration
Check if GitHub tools are available:
from sdk.tools.github_tools import coworker_git
If this import succeeds, the user has connected GitHub. If it fails, ask them to connect GitHub on the integrations
page.
SDK Tools
Important: Never run git or gh commands directly via bash. Always use the SDK tools (coworker_git, 
coworker_github_cli) which handle authentication automatically.
Repo Location
Always clone repos to /work/repos/{repo-name}/.
Worktree Workflow
Never work directly on main. Always use worktrees for tasks:
• 
• 
8
cd /work/repos/my-repo
# 1. Pull latest main
git checkout main
git pull origin main
# 2. Create worktree for your task
git worktree add ../wt-my-task -b feat/my-feature
# 3. Work in the worktree
cd ../wt-my-task
# ... make changes ...
git add .
git commit -m "Add feature"
# 4. Push and create PR
git push -u origin feat/my-feature
gh pr create --title "Add feature" --body "..."
# 5. Clean up after PR is merged
cd /work/repos/my-repo
git worktree remove ../wt-my-task
git branch -d feat/my-feature
Branch Naming
Use descriptive branch names:
feat/{description} — new features
fix/{description} — bug fixes
refactor/{description} — code improvements
Before Starting Work
Pull latest from main
Create a worktree with a descriptive branch name
Understand the codebase structure before making changes
After Completing Work
Push changes and create a PR
Clean up the worktree
Delete the local branch if merged
• 
• 
• 
• 
• 
• 
• 
• 
• 
9
