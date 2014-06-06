var helpers = {
    template: function(name, locals) {
        return require(name)(locals);
    }
};

module.exports = helpers;