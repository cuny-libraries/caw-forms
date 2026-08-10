#!/bin/sh
# Generates ROUTING.md from the campusEmails maps in each Apps Script.
# Called by the post-commit hook whenever a Code.gs file changes.

REPO_ROOT=$(git rev-parse --show-toplevel)
BENEFIT_GS="$REPO_ROOT/apps-script/benefit/Code.gs"
AGREEMENT_GS="$REPO_ROOT/apps-script/agreement/Code.gs"

cat <<'HEADER'
# CUNY Academic Works — Email Routing

When a form is submitted, an email goes to **academicworks@cuny.edu** (always) plus the campus coordinator(s) listed below.

HEADER

# -----------------------------------------------------------------------
# Agreement form — routes by CUNY affiliation (campus code in the select)
# -----------------------------------------------------------------------

cat <<'SECTION'
## Author Submission Agreement form

Routes by the faculty member's selected CUNY affiliation.

| Campus | Coordinator(s) |
|--------|---------------|
SECTION

sed -n '/var campusEmails/,/};/p' "$AGREEMENT_GS" | \
  grep -E '^\s*"[a-z]' | \
  sed 's/.*"\([^"]*\)".*:.*\(\/\/.*\)/\1|\2/' | \
  while IFS='|' read -r code comment; do
    campus=$(echo "$comment" | sed 's|^// *||' | sed 's| *$||')
    emails=$(grep "\"$code\"" "$AGREEMENT_GS" | head -1 | \
      grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+' | \
      tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')
    printf '| %s | %s |\n' "$campus" "$emails"
  done

echo ""
echo "Affiliations with no coordinator on file route to academicworks@cuny.edu only."

# -----------------------------------------------------------------------
# Benefit and accessibility forms — routes by URL prefix
# -----------------------------------------------------------------------

cat <<'SECTION'

## Benefit and Accessibility forms

Routes by the campus collection prefix in the work's URL (for example, \`gc\` in \`academicworks.cuny.edu/gc_etds/1234\`).

| Prefix | Campus / Center | Coordinator(s) |
|--------|----------------|---------------|
SECTION

sed -n '/var campusEmails/,/};/p' "$BENEFIT_GS" | \
  grep -E '^\s*"[a-z]' | \
  sed 's/.*"\([^"]*\)".*:.*\(\/\/.*\)/\1|\2/' | \
  while IFS='|' read -r prefix comment; do
    campus=$(echo "$comment" | sed 's|^// *||' | sed 's| *$||')
    emails=$(grep "\"$prefix\"" "$BENEFIT_GS" | head -1 | \
      grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+' | \
      tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')
    printf '| `%s` | %s | %s |\n' "$prefix" "$campus" "$emails"
  done

echo ""
echo "## Collection-specific overrides"
echo ""
echo "These take priority over the campus prefix when matched."
echo ""
echo "| Collection | Description | Coordinator(s) |"
echo "|------------|-------------|---------------|"

sed -n '/var collectionEmails/,/};/p' "$BENEFIT_GS" | \
  grep -E '^\s*"[a-z]' | \
  sed 's/.*"\([^"]*\)".*:.*\(\/\/.*\)/\1|\2/' | \
  while IFS='|' read -r collection comment; do
    desc=$(echo "$comment" | sed 's|^// *||' | sed 's| *$||')
    emails=$(sed -n '/var collectionEmails/,/};/p' "$BENEFIT_GS" | \
      grep "\"$collection\"" | head -1 | \
      grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+' | \
      tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')
    printf '| `%s` | %s | %s |\n' "$collection" "$desc" "$emails"
  done

echo ""
echo "## Default"
echo ""
echo "Prefixes without a specific mapping (al, cl, cw, mhc, me, oaa, slu, ufs, and any unrecognized prefix) go only to **academicworks@cuny.edu**."
