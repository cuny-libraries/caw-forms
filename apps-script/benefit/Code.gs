function sendFormByEmail(e) {
	var emailSubject = "[CAW] How access to this work benefits me...";
	var defaultEmail = "academicworks@cuny.edu";

	// Map campus collection prefixes to IR coordinator emails
	var campusEmails = {
		"asrc":   "academicworks@gc.cuny.edu",        // Advanced Science Research Center (GC)
		"bb":     ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"], // Baruch College
		"bc":     "bevans@brooklyn.cuny.edu",         // Brooklyn College
		"bm":     "jamaral@bmcc.cuny.edu",            // Borough of Manhattan Community College
		"bx":     "michael.kahn@bcc.cuny.edu",        // Bronx Community College
		"cc":     "rrapp@ccny.cuny.edu",              // The City College of New York
		"clacls": "academicworks@gc.cuny.edu",        // Center for Latin American, Caribbean, and Latino Studies (GC)
		"clags":  "academicworks@gc.cuny.edu",        // Center for LGBTQ Studies (GC)
		"cm":     "kangell@med.cuny.edu",             // CUNY School of Medicine
		"cpr":    "aa3260@hunter.cuny.edu",            // Center for Puerto Rican Studies (Hunter)
		"dsi":    "aponte@ccny.cuny.edu",              // Dominican Studies Institute (CCNY)
		"gc":     "academicworks@gc.cuny.edu",        // Graduate Center
		"gj":     "tinamarie.vella@journalism.cuny.edu", // Craig Newmark Graduate School of Journalism
		"hc":     "ifinkel@hunter.cuny.edu",          // Hunter College
		"ho":     "jtang@hostos.cuny.edu",            // Hostos Community College
		"jj":     "kokamoto@jjay.cuny.edu",           // John Jay College of Criminal Justice
		"kb":     "Michael.Kirby@kbcc.cuny.edu",      // Kingsborough Community College
		"le":     ["Vanessa.ArceSenati@lehman.cuny.edu", "michelle.ehrenpreis@lehman.cuny.edu"], // Lehman College
		"lg":     "ejardine@lagcc.cuny.edu",          // LaGuardia Community College
		"msi":    ["Vanessa.ArceSenati@lehman.cuny.edu", "michelle.ehrenpreis@lehman.cuny.edu"], // Mexican Studies Institute (Lehman)
		"nc":     "meagan.lacy@guttman.cuny.edu",     // Guttman Community College
		"ny":     "monica.berger11@citytech.cuny.edu", // New York City College of Technology
		"qb":     "wblick@qcc.cuny.edu",              // Queensborough Community College
		"qc":     "leila.walker@qc.cuny.edu",         // Queens College
		"si":     "Christina.Boyle@csi.cuny.edu",     // College of Staten Island
		"sph":    "rosemary.farrell@sph.cuny.edu",    // Graduate School of Public Health
		"sps":    ["kimmy.szeto@baruch.cuny.edu", "stephen.francoeur@baruch.cuny.edu"], // School of Professional Studies
		"yc":     "jdiao@york.cuny.edu"               // York College
		// al, cl, cw, mhc, me, oaa, slu, ufs → default (academicworks@cuny.edu)
	};

	// Collection-specific overrides (checked before campus prefix)
	var collectionEmails = {
		"gc_etds": "deposit@gc.cuny.edu",              // Graduate Center ETDs
		"jj_etds": "kcollins@jjay.cuny.edu"           // John Jay ETDs
	};

	// Parse the work URL to find the campus prefix and collection
	var workUrl = e.namedValues["Which work did you access?"].toString();
	var collMatch = workUrl.match(/academicworks\.cuny\.edu\/([a-z]+_[a-z]+)(?:\/|$)/);
	var collection = collMatch ? collMatch[1] : null;
	var prefixMatch = workUrl.match(/academicworks\.cuny\.edu\/([a-z]+)(?:_|\/)/);
	var prefix = prefixMatch ? prefixMatch[1] : null;

	var recipients = [defaultEmail];
	var coordinator = (collection && collectionEmails[collection]) || (prefix && campusEmails[prefix]);
	if (coordinator) {
		[].concat(coordinator).forEach(function (email) {
			if (email !== defaultEmail && recipients.indexOf(email) === -1) {
				recipients.push(email);
			}
		});
	}

	// Build the message body from spreadsheet headers
	var s = SpreadsheetApp.getActive().getSheetByName("Form Responses 1");
	var headers = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
	var message = "Someone shared how access to a work in CUNY Academic Works made a difference for them.\n\nThis message was forwarded to you by the Office of Library Services. If you have questions, please email academicworks@cuny.edu.\n\n--\n\n";
	for (var i in headers) {
		message += headers[i] + ':\n\n' + e.namedValues[headers[i]].toString() + '\n\n--\n\n';
	}

	MailApp.sendEmail(recipients.join(','), emailSubject, message);
}
