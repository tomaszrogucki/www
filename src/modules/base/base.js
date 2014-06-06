var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var template = require('helpers').template;


var BaseView = Backbone.View.extend({
    render: function () {
        this.$el.html(template(this.template, this.model.toJSON()));
        return this;
    }
});

var BaseCollectionView = Backbone.View.extend({
    render: function () {
        if (this.view) {
            var $fragment = $(document.createDocumentFragment());
            this.collection.each(function (model) {
                var view = new this.view({model: model});
                var viewHtml = view.render();
                $fragment.append(viewHtml.$el);
            }, this);
            this.$el.html($fragment);
        }
        else {
            this.$el.html(template(this.template, this.collection.toJSON()));
        }

        return this;
    }
});

var Base = {
    View: BaseView,
    CollectionView: BaseCollectionView
}

module.exports = Base;