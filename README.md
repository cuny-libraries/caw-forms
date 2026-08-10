# CUNY Academic Works Forms

Web forms for [CUNY Academic Works](https://academicworks.cuny.edu/), an institutional repository hosted on Digital Commons. These static HTML pages are served from an Apache web server.

## Forms

| File | Purpose |
|------|---------|
| `agreement.html` | Faculty submit an author agreement before depositing a work |
| `benefit.html` | Readers share how open access to a work made a difference |
| `accessibility.html` | Readers report an accessibility barrier with a work |

## How it works

Forms submit to Google Forms via a hidden iframe, then redirect to the corresponding thank-you page. Client-side validation uses Bootstrap's `was-validated` pattern. Anti-spam protection uses a hidden honeypot field and a minimum 5-second time-on-page check; bots are silently redirected to the thank-you page.

Each form's linked Google Sheet has an Apps Script that emails submissions to `academicworks@cuny.edu` and the appropriate campus IR coordinator:

- **Agreement form** — routes by the faculty member's selected CUNY affiliation
- **Benefit and accessibility forms** — routes by campus collection prefix in the work's URL (for example, `gc` in `academicworks.cuny.edu/gc_etds/1234`)

The agreement form also sends a confirmation copy to the faculty member's submitted email address.

See [ROUTING.md](ROUTING.md) for the full coordinator routing tables. ROUTING.md is regenerated automatically whenever a `Code.gs` file is committed.

## Workflow

### First-time server setup

```bash
git clone https://github.com/cuny-libraries/caw-forms.git
```

### Making changes

```bash
# On your Mac: push changes to GitHub
git add <files>
git commit -m "Describe what changed"
git push

# On the server: pull changes to go live
git pull
```

### Apps Scripts

Scripts are deployed via [clasp](https://github.com/google/clasp). One-time setup:

```bash
npm install        # installs clasp locally
npx clasp login    # authenticate with Google
```

To push a script after editing:

```bash
cd apps-script/agreement   # or benefit / accessibility
npx clasp push
```
