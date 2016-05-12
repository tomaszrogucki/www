var helpers = require('helpers');

var Analytics = function () {
    this.init = function () {
        if (helpers.production()) {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-57434403-2', 'auto');
        }
    };

    this.pageView = function (page) {
        if (helpers.production()) {
            ga('send', 'pageview', page);
        }
    }
};

var analytics = new Analytics();


module.exports = analytics;