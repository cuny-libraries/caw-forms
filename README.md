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
- **Benefit and accessibility forms** — routes by campus collection prefix in the work's URL (for example, `gc` in `academicworks.cuny.edu/gc_etds/1234`); see the [full routing table](https://gist.github.com/alevtina/af519ce3149a07bc3e715a3aa7ebe4f4)

The agreement form also sends a confirmation copy to the faculty member's submitted email address.

## Agreement form — coordinator routing

| Campus | Coordinator(s) |
|--------|---------------|
| Baruch College | kimmy.szeto@baruch.cuny.edu, stephen.francoeur@baruch.cuny.edu |
| Borough of Manhattan Community College | jamaral@bmcc.cuny.edu |
| Bronx Community College | michael.kahn@bcc.cuny.edu |
| Brooklyn College | bevans@brooklyn.cuny.edu |
| The City College of New York | rrapp@ccny.cuny.edu |
| College of Staten Island | Christina.Boyle@csi.cuny.edu |
| Craig Newmark Graduate School of Journalism | tinamarie.vella@journalism.cuny.edu |
| CUNY Central Office | *(default only)* |
| CUNY Graduate Center | academicworks@gc.cuny.edu |
| CUNY Graduate School of Public Health & Health Policy | rosemary.farrell@sph.cuny.edu |
| CUNY School of Labor and Urban Studies | *(default only)* |
| CUNY School of Law | *(default only)* |
| CUNY School of Medicine | kangell@med.cuny.edu |
| CUNY School of Professional Studies | kimmy.szeto@baruch.cuny.edu, stephen.francoeur@baruch.cuny.edu |
| Guttman Community College | meagan.lacy@guttman.cuny.edu |
| Hostos Community College | jtang@hostos.cuny.edu |
| Hunter College | ifinkel@hunter.cuny.edu |
| John Jay College of Criminal Justice | kokamoto@jjay.cuny.edu |
| Kingsborough Community College | Michael.Kirby@kbcc.cuny.edu |
| LaGuardia Community College | ejardine@lagcc.cuny.edu |
| Lehman College | Vanessa.ArceSenati@lehman.cuny.edu, michelle.ehrenpreis@lehman.cuny.edu |
| Medgar Evers College | *(default only)* |
| New York City College of Technology | monica.berger11@citytech.cuny.edu |
| Queens College | leila.walker@qc.cuny.edu |
| Queensborough Community College | wblick@qcc.cuny.edu |
| York College | jdiao@york.cuny.edu |

*Default only* = routes to academicworks@cuny.edu; no campus coordinator on file.

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
