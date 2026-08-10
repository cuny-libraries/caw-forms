# CUNY Academic Works Forms

Documentation hub for the web forms associated with [CUNY Academic Works](https://academicworks.cuny.edu/), the CUNY institutional repository hosted on Digital Commons. Form code lives in the [cuny-libraries/academic-works](https://github.com/cuny-libraries/academic-works) repository and is served from an Apache web server.

## Forms

| Form | File | Purpose |
|------|------|---------|
| Author Submission Agreement | `agreement.html` | Faculty grant CUNY permission to make their work publicly available |
| How does access benefit you? | `benefit.html` | Readers share how open access to a work made a difference |
| Report an accessibility issue | `accessibility.html` | Readers report barriers encountered with a work |

## Email routing

Each form submission triggers a Google Apps Script that emails `academicworks@cuny.edu` and the appropriate campus IR coordinator.

### Author Submission Agreement

Routes by the faculty member's selected CUNY affiliation.

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

The agreement form also sends a confirmation copy to the faculty member's submitted email address.

### Benefit and Accessibility Forms

Route by the campus collection prefix in the work's URL (for example, `gc` in `academicworks.cuny.edu/gc_etds/1234`). See the [full routing table](https://gist.github.com/alevtina/af519ce3149a07bc3e715a3aa7ebe4f4) (auto-updated on each commit to academic-works).

## Updating coordinator emails

Edit the `campusEmails` map in the relevant Apps Script and push via clasp:

```bash
cd academic-works/apps-script/agreement   # or benefit / accessibility
npx clasp push
```

Or paste the updated script directly into the Apps Script editor (Google Sheet → Extensions → Apps Script).
