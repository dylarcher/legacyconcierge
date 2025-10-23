#!/usr/bin/env bash
#
# Lighthouse Audit Runner
#
# This script simplifies running Lighthouse audits with various configurations.
#
# Usage:
#   ./tools/lighthouse-audit.sh [desktop|mobile|quick|report|help]
#
# Examples:
#   ./tools/lighthouse-audit.sh desktop  # Full desktop audit
#   ./tools/lighthouse-audit.sh mobile   # Full mobile audit
#   ./tools/lighthouse-audit.sh quick    # Quick single-page audit
#   ./tools/lighthouse-audit.sh report   # Generate detailed reports
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
  echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Function to show help
show_help() {
  cat << EOF
${BLUE}Lighthouse Audit Runner${NC}

${GREEN}Usage:${NC}
  ./tools/lighthouse-audit.sh [command]

${GREEN}Commands:${NC}
  ${YELLOW}desktop${NC}   - Run full desktop audit (3 runs per page)
  ${YELLOW}mobile${NC}    - Run full mobile audit (3 runs per page, throttled)
  ${YELLOW}quick${NC}     - Run quick single-page audit (requires server running)
  ${YELLOW}report${NC}    - Generate detailed HTML reports
  ${YELLOW}help${NC}      - Show this help message

${GREEN}Examples:${NC}
  ${BLUE}# Run desktop audit${NC}
  ./tools/lighthouse-audit.sh desktop

  ${BLUE}# Run mobile audit${NC}
  ./tools/lighthouse-audit.sh mobile

  ${BLUE}# Quick audit (server must be running on port 8000)${NC}
  npm run dev &
  ./tools/lighthouse-audit.sh quick

  ${BLUE}# Generate detailed reports${NC}
  ./tools/lighthouse-audit.sh report

${GREEN}Audit Thresholds:${NC}
  ${YELLOW}Performance:${NC}     Desktop ≥75%, Mobile ≥65%
  ${YELLOW}Accessibility:${NC}   ≥90% (WCAG 2.2 AA)
  ${YELLOW}Best Practices:${NC}  ≥85%
  ${YELLOW}SEO:${NC}             ≥85%

${GREEN}Core Web Vitals:${NC}
  ${YELLOW}LCP:${NC}  ≤2.5s (desktop), ≤4.0s (mobile)
  ${YELLOW}CLS:${NC}  ≤0.1
  ${YELLOW}TBT:${NC}  ≤300ms (desktop), ≤600ms (mobile)
  ${YELLOW}FCP:${NC}  ≤2.0s (desktop), ≤3.0s (mobile)

${GREEN}Output:${NC}
  - Console: Real-time audit results
  - Reports: Saved to .lighthouse/ directory (git-ignored)
  - Assertions: Pass/fail based on thresholds in configs/lighthouserc.js

EOF
}

# Main script logic
case "${1:-help}" in
  desktop)
    print_info "Running desktop Lighthouse audit..."
    npm run lighthouse
    print_success "Desktop audit complete!"
    ;;

  mobile)
    print_info "Running mobile Lighthouse audit..."
    npm run lighthouse:mobile
    print_success "Mobile audit complete!"
    ;;

  quick)
    # Check if server is running
    if ! curl -s http://localhost:8000 > /dev/null 2>&1; then
      print_error "Development server not running!"
      print_info "Start the server first: npm run dev"
      exit 1
    fi

    print_info "Running quick Lighthouse audit..."
    npm run lighthouse:quick
    print_success "Quick audit complete!"
    ;;

  report)
    print_info "Generating detailed Lighthouse reports..."
    npm run lighthouse:report
    print_success "Reports generated in .lighthouse/ directory"
    print_info "Open .lighthouse/index.html to view results"
    ;;

  help|--help|-h)
    show_help
    ;;

  *)
    print_error "Unknown command: $1"
    echo ""
    show_help
    exit 1
    ;;
esac
