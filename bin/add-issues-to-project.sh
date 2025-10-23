#!/bin/bash
#
# Add GitHub Issues to Project Board
#
# Prerequisites:
# 1. Authenticate with project scope:
#    gh auth refresh -h github.com -s project
# 2. Run this script:
#    ./bin/add-issues-to-project.sh
#

set -e

REPO="dylarcher/legacyconcierge"
PROJECT_NUMBER=18

echo "🔍 Fetching project details..."

# Get project ID
PROJECT_DATA=$(gh api graphql -f query='
{
  user(login: "dylarcher") {
    projectV2(number: '$PROJECT_NUMBER') {
      id
      title
    }
  }
}')

PROJECT_ID=$(echo "$PROJECT_DATA" | jq -r '.data.user.projectV2.id')
PROJECT_TITLE=$(echo "$PROJECT_DATA" | jq -r '.data.user.projectV2.title')

if [ "$PROJECT_ID" = "null" ]; then
  echo "❌ Error: Could not find project #$PROJECT_NUMBER"
  echo "Response: $PROJECT_DATA"
  exit 1
fi

echo "✓ Found project: $PROJECT_TITLE (ID: $PROJECT_ID)"
echo ""

# Get all open issues
echo "📋 Fetching open issues from $REPO..."
ISSUES=$(gh issue list --repo "$REPO" --limit 100 --json number,title,url --state open)
ISSUE_COUNT=$(echo "$ISSUES" | jq length)

echo "✓ Found $ISSUE_COUNT open issues"
echo ""

# Add each issue to the project
ADDED=0
SKIPPED=0
FAILED=0

for row in $(echo "$ISSUES" | jq -r '.[] | @base64'); do
  _jq() {
    echo "${row}" | base64 --decode | jq -r "${1}"
  }

  ISSUE_NUMBER=$(_jq '.number')
  ISSUE_TITLE=$(_jq '.title')
  ISSUE_URL=$(_jq '.url')

  echo "Processing issue #$ISSUE_NUMBER: $ISSUE_TITLE"

  # Get issue node ID
  ISSUE_DATA=$(gh api graphql -f query='
  query {
    repository(owner: "dylarcher", name: "legacyconcierge") {
      issue(number: '$ISSUE_NUMBER') {
        id
      }
    }
  }')

  ISSUE_ID=$(echo "$ISSUE_DATA" | jq -r '.data.repository.issue.id')

  if [ "$ISSUE_ID" = "null" ]; then
    echo "  ❌ Error: Could not get issue ID"
    ((FAILED++))
    continue
  fi

  # Add issue to project
  RESULT=$(gh api graphql -f query='
  mutation {
    addProjectV2ItemById(input: {
      projectId: "'$PROJECT_ID'"
      contentId: "'$ISSUE_ID'"
    }) {
      item {
        id
      }
    }
  }' 2>&1)

  if echo "$RESULT" | grep -q '"id"'; then
    echo "  ✅ Added to project"
    ((ADDED++))
  elif echo "$RESULT" | grep -q "already exists"; then
    echo "  ⏭️  Already in project"
    ((SKIPPED++))
  else
    echo "  ❌ Failed: $RESULT"
    ((FAILED++))
  fi

  echo ""
done

echo "========================================="
echo "Summary:"
echo "  Added:   $ADDED"
echo "  Skipped: $SKIPPED"
echo "  Failed:  $FAILED"
echo "  Total:   $ISSUE_COUNT"
echo "========================================="

if [ $ADDED -gt 0 ]; then
  echo ""
  echo "✓ Successfully added $ADDED issues to project #$PROJECT_NUMBER"
  echo "View at: https://github.com/users/dylarcher/projects/$PROJECT_NUMBER"
fi
