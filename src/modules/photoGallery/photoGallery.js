var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Base = require('base');

var PhotoModel = Backbone.Model.extend({
});

var PhotoCollection = Backbone.Collection.extend({
    url: function() {
        return 'api/v1/photos/' + this.page;
    },

    model: PhotoModel,

    initialize: function() {
        this.page = 0;
    },

    fetch: function() {
        Backbone.Collection.prototype.fetch.apply(this, arguments);
        this.page += 1;
    }
});

var PhotoView = Base.View.extend({
    template: 'photoGalleryTemplate',
    className: 'photoContainer'
});

var PhotoCollectionView = Base.CollectionView.extend({
    el: '#mainContainer',
    view: PhotoView,

    events: {
        'scroll': 'infiniteScroll'
    },

    initialize: function () {
        this.photoWidth = 400;
        this.padding = 20;
        var combinedWidth = this.photoWidth + this.padding;
        var containerWidth = this.$el.width();

        // TODO: remove this hack
        this.modelNumber = 0;

        var numberOfColumns = Math.floor(containerWidth / combinedWidth);
        var remainingWidth = containerWidth - numberOfColumns * combinedWidth;

        if(remainingWidth > combinedWidth / 2) {
            numberOfColumns += 1;
        }

        var columnWidth = containerWidth / numberOfColumns;
        if(columnWidth - 2 * this.padding < this.photoWidth) {
            this.photoWidth = columnWidth - 2 * this.padding;
        }

        this.$columns = [];
        for(var i = 0; i < numberOfColumns; i++) {
            var $column = $('<div></div>');
            $column.addClass('photoColumn').width(columnWidth);
            this.$el.append($column);
            this.$columns[i] = $column;
        }

        this.listenTo(this.collection, 'add', this.collectionAdd.bind(this));
    },

    collectionAdd: function (model) {
        var columnHeights = _.map(this.$columns, function($column) {
            return $column.height();
        });

        var shortestColumnId = columnHeights.indexOf(Math.min.apply(null, columnHeights));
        var $shortestColumn = this.$columns[shortestColumnId];

        var view = new this.view({model: model});
        var renderedView = view.render();
        renderedView.$el.css('margin-top', this.padding).width(this.photoWidth);
        renderedView.$el.find('img').width(this.photoWidth).height(this.photoWidth / model.get('ratio'));
        $shortestColumn.append(renderedView.$el);

        // TODO: remove this hack
        this.modelNumber += 1;
        if(this.modelNumber === 10) {
            this.infiniteScroll();
        }
    },

    infiniteScroll: function() {
        var scroll = this.$el.scrollTop();
        var height = this.$el.height();
        var columnHeight = _.max(_.map(this.$columns, function($column) {
            return $column.height();
        }));

        if(columnHeight - height - scroll < 0.2 * height) {
            this.collection.fetch();
        }

    }
});

$(document).ready(function () {
    var photoCollection = new PhotoCollection();
    var photoCollectionView = new PhotoCollectionView({collection: photoCollection});

    photoCollection.fetch();
});
