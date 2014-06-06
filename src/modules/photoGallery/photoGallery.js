var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Base = require('base');

var PhotoModel = Backbone.Model.extend({
});

var PhotoCollection = Backbone.Collection.extend({
    url: 'api/v1/photos',
    model: PhotoModel
});

var PhotoView = Base.View.extend({
    template: 'photoGalleryTemplate',
    className: 'photoContainer'
});

var PhotoCollectionView = Base.CollectionView.extend({
    el: '#mainContainer',
    view: PhotoView,

    initialize: function () {
        this.listenTo(this.collection, 'reset', this.render.bind(this));
        this.listenTo(this.collection, 'reset', this.collectionChange);
    },

    render: function () {
        var photoWidth = 400;
        var padding = 20;
        var combinedWidth = photoWidth + padding;
        var containerWidth = this.$el.width();

        var numberOfColumns = Math.floor(containerWidth / combinedWidth);
        var remainingWidth = containerWidth - numberOfColumns * combinedWidth;

        if(remainingWidth > combinedWidth / 2) {
            numberOfColumns += 1;
        }

        var columnWidth = containerWidth / numberOfColumns;
        if(columnWidth - 2 * padding < photoWidth) {
            photoWidth = columnWidth - 2 * padding;
        }

        var $columns = [];
        for(var i = 0; i < numberOfColumns; i++) {
            var $column = $('<div></div>');
            $column.addClass('photoColumn').width(columnWidth);
            this.$el.append($column);
            $columns[i] = $column;
        }

        this.collection.each(function (model) {
            var columnHeights = _.map($columns, function($column) {
                return $column.height();
            });

            var shortestColumnId = columnHeights.indexOf(Math.min.apply(null, columnHeights));
            var $shortestColumn = $columns[shortestColumnId];

            var view = new this.view({model: model});
            var renderedView = view.render();
            renderedView.$el.css('margin-top', padding).width(photoWidth);
            renderedView.$el.find('img').width(photoWidth).height(photoWidth / model.ratio);
            $shortestColumn.append(renderedView.$el);
        }, this);

        return this;
    },

    collectionChange: function () {
        // rerender
    }
});

$(document).ready(function () {
    var photoCollection = new PhotoCollection();
    var photoCollectionView = new PhotoCollectionView({collection: photoCollection});

    photoCollection.fetch({reset: true});
});
