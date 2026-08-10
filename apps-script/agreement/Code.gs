function sendFormByEmail(e) {
	var defaultEmail = "academicworks@cuny.edu";

	// Map campus codes (sent by the affiliation <select>) to IR coordinator emails.
	// Codes match the option values in index.html.
	var campusEmails = {
		"bb":      ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"], // Baruch College
		"bc":      "bevans@brooklyn.cuny.edu",          // Brooklyn College
		"bm":      "jamaral@bmcc.cuny.edu",             // Borough of Manhattan Community College
		"bx":      "michael.kahn@bcc.cuny.edu",         // Bronx Community College
		"cc":      "rrapp@ccny.cuny.edu",               // The City College of New York
		"cm":      "kangell@med.cuny.edu",              // CUNY School of Medicine
		"gc":      "academicworks@gc.cuny.edu",         // CUNY Graduate Center
		"gj":      "tinamarie.vella@journalism.cuny.edu", // Craig Newmark Graduate School of Journalism
		"hc":      "ifinkel@hunter.cuny.edu",           // Hunter College
		"ho":      "jtang@hostos.cuny.edu",             // Hostos Community College
		"jj":      "kokamoto@jjay.cuny.edu",            // John Jay College of Criminal Justice
		"kb":      "Michael.Kirby@kbcc.cuny.edu",       // Kingsborough Community College
		"le":      ["Vanessa.ArceSenati@lehman.cuny.edu", "michelle.ehrenpreis@lehman.cuny.edu"], // Lehman College
		"lg":      "ejardine@lagcc.cuny.edu",           // LaGuardia Community College
		"nc":      "meagan.lacy@guttman.cuny.edu",      // Guttman Community College
		"ny":      "monica.berger11@citytech.cuny.edu", // New York City College of Technology
		"qb":      "wblick@qcc.cuny.edu",               // Queensborough Community College
		"qc":      "leila.walker@qc.cuny.edu",          // Queens College
		"si":      "Christina.Boyle@csi.cuny.edu",      // College of Staten Island
		"sph":     "rosemary.farrell@sph.cuny.edu",     // CUNY Graduate School of Public Health & Health Policy
		"sps":     ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"], // CUNY School of Professional Studies
		"yc":      "jdiao@york.cuny.edu"                // York College
		// central, law, me, slu → default (academicworks@cuny.edu); add coordinator emails here when known
	};

	// Extract submission values.
	// NOTE: These keys must match the Google Form question text exactly.
	var firstName   = (e.namedValues["First Name"]       || [""])[0].trim();
	var lastName    = (e.namedValues["Last Name"]        || [""])[0].trim();
	var affiliation = (e.namedValues["CUNY Affiliation"] || [""])[0].trim();
	var facultyEmail = (e.namedValues["Email"]           || [""])[0].trim();
	var titles      = (e.namedValues["Titles of Works"]  || [""])[0].trim();

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
		"This message was forwarded to you by the Office of Library Services. If you have questions, please email academicworks@cuny.edu.\n\n--\n\n";
	for (var i in headers) {
		message += headers[i] + ":\n\n" + (e.namedValues[headers[i]] || [""]).toString() + "\n\n--\n\n";
	}

	MailApp.sendEmail(recipients.join(","), emailSubject, message);

	// Send a confirmation copy to the faculty member
	if (facultyEmail) {
		var titleList = titles
			? titles.split("\n").map(function (t) { return "  \u2022 " + t; }).join("\n")
			: "(no titles provided)";

		var confirmSubject = "Your CUNY Academic Works submission agreement";
		var confirmMessage =
			"Dear " + firstName + ",\n\n" +
			"Thank you for submitting your author agreement to CUNY Academic Works. " +
			"Here is a copy of what you submitted:\n\n" +
			"Name: " + firstName + " " + lastName + "\n" +
			"CUNY Affiliation: " + affiliation + "\n" +
			"Email: " + facultyEmail + "\n\n" +
			"Works covered by this agreement:\n" + titleList + "\n\n" +
			"It is suggested that you save or print this email for your records.\n\n" +
			"If you have any questions, please contact academicworks@cuny.edu.";

		MailApp.sendEmail(facultyEmail, confirmSubject, confirmMessage);
	}
}
