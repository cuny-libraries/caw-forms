(function () {
	var iframe = document.createElement('iframe');
	iframe.src = 'https://ols.cuny.edu/academicworks/agreement.html?embed=1';
	iframe.title = 'Author Submission Agreement';
	iframe.style.cssText = 'width:100%;border:none;display:block;min-height:600px;';
	iframe.setAttribute('scrolling', 'no');

	// Resize iframe to fit content as user interacts with the form
	window.addEventListener('message', function (e) {
		if (e.origin === 'https://ols.cuny.edu' && e.data && e.data.cawIframeHeight) {
			iframe.style.height = (e.data.cawIframeHeight + 24) + 'px';
		}
	});

	document.currentScript.parentNode.replaceChild(iframe, document.currentScript);
})();
