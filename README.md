# CUNY Academic Works Forms

Web forms for [CUNY Academic Works](https://academicworks.cuny.edu/), CUNY's
open-access institutional repository. When someone submits a form, an email goes
to the Office of Library Services and the appropriate campus IR coordinator.

## The forms

| Form | Who uses it | What it does |
|------|-------------|--------------|
| `agreement.html` | Faculty | Signs an author agreement before depositing a work |
| `benefit.html` | Readers | Shares how open access to a work made a difference |
| `accessibility.html` | Readers | Reports an accessibility barrier with a work |

Each form has a matching thank-you page (`thanks-agreement.html`, etc.) and is
served from the CUNY OLS web server at `ols.cuny.edu/academicworks/`.

## How it works

Forms submit to Google Forms using the browser's `fetch()` API, then redirect
to the corresponding thank-you page after 500ms. Client-side validation uses
Bootstrap's `was-validated` pattern. Anti-spam protection uses a hidden honeypot
field and a minimum 3-second time-on-page check; bots are silently redirected to
the thank-you page without submitting data.

Each form is connected to a Google Sheet. When someone submits a form, a Google
Apps Script reads the submission and emails it to `academicworks@cuny.edu` plus
the campus IR coordinator for that submission:

- **Agreement form** — routes by the faculty member's selected CUNY campus
- **Benefit and accessibility forms** — routes by the campus prefix in the
  work's URL (for example, `gc` in `academicworks.cuny.edu/gc_etds/1234`)

The agreement form also sends a confirmation copy to the faculty member.

See [ROUTING.md](ROUTING.md) for the full list of campuses and coordinator
email addresses. ROUTING.md is regenerated automatically whenever a `Code.gs`
file is committed.

## Embedding the agreement form

The agreement form can be embedded in a third-party CMS (such as the
`academicworks.cuny.edu` site) using a single script tag:

```html
<script src="https://cuny-libraries.github.io/caw-forms/agreement-embed.js"></script>
```

This script creates an iframe pointing to the GitHub Pages version of the form
and auto-resizes it as the user interacts with it. The form detects the `?embed=1`
URL parameter and shows a simplified header — just the page title, no logo or
border — and hides the footer.

The form is served from **GitHub Pages** (`cuny-libraries.github.io/caw-forms/`)
for embedding rather than from `ols.cuny.edu`, because some browsers block
requests from public sites to servers on private IP ranges. GitHub Pages has a
public IP and is not subject to this restriction.

No separate maintenance is needed: pushing to `main` updates both the
`ols.cuny.edu` server (via `git pull`) and GitHub Pages (automatically).

## Setup

### 1. Clone the repository

On your local machine:

```bash
git clone https://github.com/cuny-libraries/caw-forms.git
```

On the server (first time only):

```bash
cd /var/www/html/academicworks
git clone https://github.com/cuny-libraries/caw-forms.git .
```

### 2. Install clasp (one time, local machine only)

[clasp](https://github.com/google/clasp) is the command-line tool that deploys
Apps Script files to Google. The server does not need it — clasp is only used
from your local machine.

From the repo root:

```bash
npm install       # installs clasp
npx clasp login   # authenticate with your Google account
```

## Making changes

### HTML form changes

Edit the relevant file (`agreement.html`, `benefit.html`, `accessibility.html`,
or a thank-you page) locally, then:

```bash
git add <filename>
git commit -m "Describe what changed"
git push
```

Then on the server:

```bash
cd /var/www/html/academicworks
git pull
```

### Apps Script changes (email routing, notification text)

The script files in `apps-script/` control email routing and the content of
notification emails. Edit them locally — do not edit directly in the Google
Apps Script editor, so that changes are tracked in version control.

After committing a `Code.gs` change, the post-commit hook attempts to deploy
it automatically via clasp. If that fails, deploy manually:

```bash
cd apps-script/agreement   # or benefit / accessibility
npx clasp push
```

## Common tasks

### Update a coordinator's email address

1. Open the relevant `Code.gs` file in `apps-script/agreement/`, `benefit/`,
   or `accessibility/`
2. Find the campus in the `campusEmails` map and update the address
3. Commit and push; clasp will deploy the script automatically

### Add a coordinator for a campus currently routed to default

1. Add an entry to `campusEmails` in the relevant `Code.gs`
2. For the agreement form only, also add the campus to `campusNames`
3. Commit and push

### Edit the agreement or notification text

For the **form page itself**, edit `agreement.html` and commit/push/pull on
the server.

For the **emails sent to coordinators or faculty**, edit the relevant `Code.gs`
and commit/push (clasp deploys the script; no server pull needed).
