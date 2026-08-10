function sendFormByEmail(e) {
	var defaultEmail = "academicworks@cuny.edu";

	// Maps the full campus name (as submitted by the affiliation dropdown) to coordinator email(s).
	// Values must match the Google Form dropdown option text exactly.
	var campusEmails = {
		"bb":   ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"],  // Baruch College
		"bm":   "jamaral@bmcc.cuny.edu",            // Borough of Manhattan Community College
		"bx":   "michael.kahn@bcc.cuny.edu",        // Bronx Community College
		"bc":   "bevans@brooklyn.cuny.edu",          // Brooklyn College
		"cc":   "rrapp@ccny.cuny.edu",               // The City College of New York
		"si":   "Christina.Boyle@csi.cuny.edu",      // College of Staten Island
		"gj":   "tinamarie.vella@journalism.cuny.edu", // Craig Newmark Graduate School of Journalism
		"gc":   "academicworks@gc.cuny.edu",         // CUNY Graduate Center
		"sph":  "rosemary.farrell@sph.cuny.edu",     // CUNY Graduate School of Public Health & Health Policy
		"cm":   "kangell@med.cuny.edu",              // CUNY School of Medicine
		"sps":  ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"],  // CUNY School of Professional Studies
		"nc":   "meagan.lacy@guttman.cuny.edu",      // Guttman Community College
		"ho":   "jtang@hostos.cuny.edu",             // Hostos Community College
		"hc":   "ifinkel@hunter.cuny.edu",           // Hunter College
		"jj":   "kokamoto@jjay.cuny.edu",            // John Jay College of Criminal Justice
		"kb":   "Michael.Kirby@kbcc.cuny.edu",       // Kingsborough Community College
		"lg":   "ejardine@lagcc.cuny.edu",           // LaGuardia Community College
		"le":   ["Vanessa.ArceSenati@lehman.cuny.edu", "michelle.ehrenpreis@lehman.cuny.edu"],  // Lehman College
		"ny":   "monica.berger11@citytech.cuny.edu", // New York City College of Technology
		"qc":   "leila.walker@qc.cuny.edu",          // Queens College
		"qb":   "wblick@qcc.cuny.edu",               // Queensborough Community College
		"yc":   "jdiao@york.cuny.edu"                // York College
		// al, cl, slu, me → default only (academicworks@cuny.edu); add entries here when coordinators are known
	};

	// Maps campus codes (sent by the HTML form) to human-readable names for display in emails.
	var campusNames = {
		"bb":  "Baruch College",
		"bm":  "Borough of Manhattan Community College",
		"bx":  "Bronx Community College",
		"bc":  "Brooklyn College",
		"cc":  "The City College of New York",
		"si":  "College of Staten Island",
		"gj":  "Craig Newmark Graduate School of Journalism",
		"al":  "CUNY Central Office",
		"gc":  "CUNY Graduate Center",
		"sph": "CUNY Graduate School of Public Health & Health Policy",
		"slu": "CUNY School of Labor and Urban Studies",
		"cl":  "CUNY School of Law",
		"cm":  "CUNY School of Medicine",
		"sps": "CUNY School of Professional Studies",
		"nc":  "Guttman Community College",
		"ho":  "Hostos Community College",
		"hc":  "Hunter College",
		"jj":  "John Jay College of Criminal Justice",
		"kb":  "Kingsborough Community College",
		"lg":  "LaGuardia Community College",
		"le":  "Lehman College",
		"me":  "Medgar Evers College",
		"ny":  "New York City College of Technology",
		"qc":  "Queens College",
		"qb":  "Queensborough Community College",
		"yc":  "York College"
	};

	// Extract submission values.
	// NOTE: These keys must match the Google Form question text exactly.
	var firstName    = (e.namedValues["First Name"]       || [""])[0].trim();
	var lastName     = (e.namedValues["Last Name"]        || [""])[0].trim();
	var affiliation  = (e.namedValues["CUNY Affiliation"] || [""])[0].trim();
	var facultyEmail = (e.namedValues["Email"]            || [""])[0].trim();
	var titles       = (e.namedValues["Titles of Works"]  || [""])[0].trim();

	var campusLabel = campusNames[affiliation] || affiliation;

	// Build the coordinator recipient list
	var recipients = [defaultEmail];
	var coordinator = campusEmails[affiliation];
	if (coordinator) {
		[].concat(coordinator).forEach(function (email) {
			if (email !== defaultEmail && recipients.indexOf(email) === -1) {
				recipients.push(email);
			}
		});
	}

	// Build the coordinator notification email
	var emailSubject = "[CAW] Author Submission Agreement \u2014 " + firstName + " " + lastName;

	var s = SpreadsheetApp.getActive().getSheetByName("Form Responses 1");
	var headers = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
	var message = firstName + " " + lastName + " has submitted an author agreement for deposit to CUNY Academic Works.\n\n" +
		"Campus: " + campusLabel + "\n\n" +
		"This message was forwarded to you by the Office of Library Services. If you have questions, please email academicworks@cuny.edu.\n\n--\n\n";
	for (var i in headers) {
		var value = (e.namedValues[headers[i]] || [""]).toString();
		if (headers[i] === "CUNY Affiliation") { value = campusNames[value] || value; }
		message += headers[i] + ":\n\n" + value + "\n\n--\n\n";
	}

	MailApp.sendEmail(recipients.join(","), emailSubject, message);

	// Send a confirmation copy to the faculty member
	if (facultyEmail) {
		var titleList = titles
			? titles.split("\n").map(function (t) { return "  \u2022 " + t; }).join("\n")
			: "(no titles provided)";

		var agreementText =
			"CUNY Academic Works \u2014 Submission Agreement\n\n" +
			"By submitting this form, I grant the City University of New York non-exclusive right to make a digital copy of my submission (\"the Work\") publicly accessible over the Internet as part of CUNY Academic Works, or any successor initiative at CUNY. I understand that granting this right does not alter my copyright or other rights to the work that I might hold.\n\n" +
			"I warrant as follows:\n" +
			"  \u2022 that I have the full power and authority to make this agreement;\n" +
			"  \u2022 that the Work does not infringe any copyright, nor violate any proprietary rights, nor contain any libelous matter, nor invade the privacy of any person or third party;\n" +
			"  \u2022 that no right in the Work has in any way been sold, mortgaged, or otherwise disposed of, and that the Work is free from all liens and claims.\n\n" +
			"I understand that once a work is approved by the repository administrator, it may not be edited or removed.";

		var confirmSubject = "Your CUNY Academic Works submission agreement";
		var confirmMessage =
			"Dear " + firstName + ",\n\n" +
			"Thank you for submitting your author agreement to CUNY Academic Works. " +
			"Here is a copy of what you submitted:\n\n" +
			"Name: " + firstName + " " + lastName + "\n" +
			"CUNY Affiliation: " + campusLabel + "\n" +
			"Email: " + facultyEmail + "\n\n" +
			"Works covered by this agreement:\n" + titleList + "\n\n" +
			"--\n\n" +
			agreementText + "\n\n" +
			"--\n\n" +
			"It is suggested that you save or print this email for your records.\n\n" +
			"If you have any questions, please contact academicworks@cuny.edu.";

		MailApp.sendEmail(facultyEmail, confirmSubject, confirmMessage);
	}
}
