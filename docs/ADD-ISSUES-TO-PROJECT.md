# Adding GitHub Issues to Project Board

This guide explains how to add all repository issues to GitHub Project Board #18.

## Prerequisites

1. **GitHub CLI installed** - Already available in this repository
2. **Authentication with project scope** - Required to access GitHub Projects API

## Quick Start

### Step 1: Authenticate GitHub CLI with Project Scope

The GitHub CLI needs the `project` scope to access GitHub Projects (beta):

```bash
gh auth refresh -h github.com -s project
```

This will:
1. Display a one-time device code (e.g., `B136-64E9`)
2. Provide a URL to visit: https://github.com/login/device
3. Wait for you to complete authentication in your browser

**To complete authentication:**
1. Copy the device code shown in the terminal
2. Open the URL in your browser
3. Paste the device code
4. Authorize the GitHub CLI app with project scope
5. Return to the terminal - authentication will complete automatically

### Step 2: Run the Script

Once authenticated, run the automation script:

```bash
./bin/add-issues-to-project.sh
```

The script will:
1. Fetch project #18 details
2. List all open issues from the repository
3. Add each issue to the project board
4. Skip issues already in the project
5. Provide a summary of results

## What the Script Does

The `add-issues-to-project.sh` script:

- **Fetches** all open issues from `dylarcher/legacyconcierge`
- **Adds** each issue to Project Board #18
- **Skips** issues already in the project (idempotent)
- **Reports** success/failure for each issue
- **Summarizes** results (added, skipped, failed)

## Expected Output

```
🔍 Fetching project details...
✓ Found project: Legacy Concierge Project (ID: PVT_...)

📋 Fetching open issues from dylarcher/legacyconcierge...
✓ Found 17 open issues

Processing issue #45: Navigation links use relative paths...
  ✅ Added to project

Processing issue #43: The validation logic is duplicated...
  ✅ Added to project

Processing issue #26: [Phase 5.3.1] Documentation Finalization
  ✅ Added to project

[... continues for all issues ...]

=========================================
Summary:
  Added:   17
  Skipped: 0
  Failed:  0
  Total:   17
=========================================

✓ Successfully added 17 issues to project #18
View at: https://github.com/users/dylarcher/projects/18
```

## Troubleshooting

### Error: "Your token has not been granted the required scopes"

**Cause:** GitHub CLI doesn't have the `project` scope.

**Solution:** Run the authentication command:
```bash
gh auth refresh -h github.com -s project
```

### Error: "Could not find project #18"

**Cause:** Project number is incorrect or you don't have access.

**Solution:**
1. Verify project exists at https://github.com/users/dylarcher/projects/18
2. Check you're logged in as `dylarcher`
3. Confirm project number in the script (line 11)

### Error: "Issue already exists in project"

**Not an error!** The script detects this and skips the issue. This is expected behavior when re-running the script.

## Manual Alternative

If you prefer not to use the script, you can add issues manually:

1. Visit https://github.com/users/dylarcher/projects/18
2. Click "Add item" button
3. Search for issues by number or title
4. Select each issue to add it to the board

## Files

- **Script:** `bin/add-issues-to-project.sh`
- **Documentation:** `docs/ADD-ISSUES-TO-PROJECT.md` (this file)

## Issues in Repository

As of the last check, the repository has **17 open issues**:

1. **#45** - Navigation links use relative paths
2. **#43** - Validation logic is duplicated
3. **#26** - [Phase 5.3.1] Documentation Finalization
4. **#25** - [Phase 5.2.2] Production Deployment
5. **#24** - [Phase 5.2.1] Staging Deployment and Final Testing
6. **#23** - [Phase 5.1.4] Monitoring and Analytics Setup
7. **#22** - [Phase 5.1.3] Production Environment Setup
8. **#21** - [Phase 4.3.1] Cross-Browser Compatibility Testing
9. **#20** - [Phase 4.2.1] Lighthouse Performance Optimization
10. **#19** - [Phase 4.1.4] Accessibility Compliance Validation
11. **#18** - [Phase 4.1.1] Unit Test Coverage Achievement
12. **#8** - [Phase 2.2.2] Lighthouse CI Integration
13. **#7** - [Phase 2.2.1] GitHub Actions CI/CD Pipeline Setup
14. **#5** - [Phase 2.1.1] Technical Architecture Documentation
15. **#4** - [Phase 1.2.2] Development Environment Standards
16. **#3** - [Phase 1.2.1] GitHub Repository and Project Board Setup
17. **#2** - [Phase 1.1.2] Technical Feasibility Assessment
18. **#1** - [Phase 1.1.1] Define Project Scope and Success Metrics

All issues will be added to the project board when you run the script.

## Next Steps

After adding issues to the project:

1. **Organize** - Arrange issues in columns (Todo, In Progress, Done)
2. **Prioritize** - Reorder by importance
3. **Assign** - Add assignees to each issue
4. **Track** - Use the board to track project progress

## Support

For issues with this script, check:
- GitHub CLI version: `gh --version`
- Authentication status: `gh auth status`
- Project access: Visit https://github.com/users/dylarcher/projects/18
