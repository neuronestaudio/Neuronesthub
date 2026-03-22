(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        return;
    }

    var NAV_DELAY_MS = 220;
    var isLeaving = false;

    function isModifiedClick(event) {
        return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    }

    function isTransitionableLink(link) {
        if (!link || !link.href) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;

        var rawHref = link.getAttribute('href') || '';
        if (!rawHref || rawHref === '#') return false;
        if (rawHref.indexOf('mailto:') === 0 || rawHref.indexOf('tel:') === 0 || rawHref.indexOf('javascript:') === 0) {
            return false;
        }

        var url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (error) {
            return false;
        }

        if (url.origin !== window.location.origin) return false;

        var samePath = url.pathname === window.location.pathname;
        if (samePath && url.hash) return false;

        return true;
    }

    function leaveTo(url) {
        if (isLeaving) return;
        isLeaving = true;
        document.body.classList.add('nn-page-leaving');

        window.setTimeout(function () {
            window.location.href = url;
        }, NAV_DELAY_MS);
    }

    document.addEventListener('click', function (event) {
        if (isModifiedClick(event)) return;

        var link = event.target.closest('a');
        if (!isTransitionableLink(link)) return;

        event.preventDefault();
        leaveTo(link.href);
    }, true);

    // Ensure restored pages from browser cache do not stay in leaving state.
    window.addEventListener('pageshow', function () {
        isLeaving = false;
        document.body.classList.remove('nn-page-leaving');
    });
})();