var helpers = {
    template: function(name, locals) {
        return require(name)(locals);
    },

    production: function () {
        return location.hostname.match(/(.com)|(.pl)$/) ? true : false;
    }
};

module.exports = helpers;