(function () {
	var iframe = document.createElement('iframe');
	iframe.src = 'https://cuny-libraries.github.io/caw-forms/agreement.html?embed=1';
	iframe.title = 'Author Submission Agreement';
	iframe.style.cssText = 'width:100%;border:none;display:block;min-height:600px;';
	iframe.setAttribute('scrolling', 'no');

	// Resize iframe to fit content as user interacts with the form
	window.addEventListener('message', function (e) {
		if (e.origin === 'https://cuny-libraries.github.io' && e.data && e.data.cawIframeHeight) {
			iframe.style.height = (e.data.cawIframeHeight + 24) + 'px';
		}
	});

	// document.currentScript is null when the script is deferred/async
	var scriptEl = document.currentScript ||
		document.querySelector('script[src*="agreement-embed"]');
	if (scriptEl) {
		scriptEl.parentNode.replaceChild(iframe, scriptEl);
	} else {
		document.body.appendChild(iframe);
	}
})();
