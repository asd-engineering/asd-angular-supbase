#!/usr/bin/env bash
set -euo pipefail

WORKFLOW=".github/workflows/devinci.yml"
API="https://api.asd.host/functions/v1/server-discover"

# Fetch available regions from public server-discover endpoint
# Each call returns the best server per tier; collect all unique regions
REGIONS=""
for tier in free pro enterprise; do
  R=$(curl -sf "${API}?tier=${tier}" 2>/dev/null | jq -r '.region // empty' 2>/dev/null || true)
  if [ -n "$R" ]; then
    REGIONS="${REGIONS}${R}"$'\n'
  fi
done
REGIONS=$(echo "$REGIONS" | sort -u | sed '/^$/d')

# Clean existing region input + pass-through
awk '
  /^      region:/ && in_inputs { skip=1; next }
  skip && /^      [a-z]/ { skip=0 }
  skip { next }
  /^          region: \$\{\{ inputs\.region \}\}/ { next }
  /^    inputs:/ { in_inputs=1 }
  /^concurrency:/ { in_inputs=0 }
  { print }
' "$WORKFLOW" > "${WORKFLOW}.tmp" && mv "${WORKFLOW}.tmp" "$WORKFLOW"

if [ -z "$REGIONS" ]; then
  echo "No regions found. Region input removed."
  exit 0
fi

COUNT=$(echo "$REGIONS" | wc -l | tr -d ' ')
echo "Found ${COUNT} region(s): $(echo "$REGIONS" | tr '\n' ' ')"

# Build options for awk
OPTS=$(while IFS= read -r r; do echo "          - $r"; done <<< "$REGIONS")

# Insert region choice input before asd-version + pass-through in with: block
awk -v opts="$OPTS" '
  /^      asd-version:/ && !rd {
    print "      region:"
    print "        description: \x27Tunnel server region\x27"
    print "        required: false"
    print "        default: \x27default\x27"
    print "        type: choice"
    print "        options:"
    print "          - default"
    print "          - User Default"
    n = split(opts, lines, "\n")
    for (i = 1; i <= n; i++) print lines[i]
    rd = 1
  }
  /^          asd-version:/ && !pd {
    print "          region: ${{ inputs.region }}"
    pd = 1
  }
  { print }
' "$WORKFLOW" > "${WORKFLOW}.tmp" && mv "${WORKFLOW}.tmp" "$WORKFLOW"

echo "Updated ${WORKFLOW}"
