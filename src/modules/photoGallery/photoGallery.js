var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Base = require('base');

var PhotoModel = Backbone.Model.extend({
});

var PhotoCollection = Backbone.Collection.extend({
    url: function () {
        return 'api/v1/photos/' + this.page;
    },

    model: PhotoModel,

    initialize: function () {
        this.page = 0;
    },

    fetch: function () {
        Backbone.Collection.prototype.fetch.apply(this, arguments);
        this.page += 1;
    }
});

var PhotoModalView = Base.View.extend({
    template: 'photoModalTemplate',
    className: 'photoModal',

    events: {
        'click': '_closeModal'
    },

    render: function () {
        Base.View.prototype.render.apply(this, arguments);
        $('body').prepend(this.$el);
    },

    _closeModal: function () {
        this.remove();
    }
});

var PhotoView = Base.View.extend({
    template: 'photoGalleryTemplate',
    className: 'photoContainer',

    events: {
        'click': '_photoClicked'
    },

    _photoClicked: function () {
        var photoModalView = new PhotoModalView({model: this.model});
        photoModalView.render();
//{img: this.model.get('img')
    }
});

var PhotoCollectionView = Base.CollectionView.extend({
    el: '#mainContainer',
    view: PhotoView,

    events: {
        'scroll': 'infiniteScroll'
    },

    initialize: function () {
        // TODO: remove this hack
        this.modelNumber = 0;
        this.modelsLoaded = false;
        this.perPage = 10;

        var widths = this.calculateWidths();
        this.photoWidth = widths.photoWidth;
        this.padding = widths.padding;
        this.columnWidth = widths.columnWidth;
        this.numberOfColumns = widths.numberOfColumns;

        this.$columns = [];
        for (var i = 0; i < widths.numberOfColumns; i++) {
            var $column = $('<div></div>');
            $column.addClass('photoColumn').width(widths.columnWidth);
            this.$el.append($column);
            this.$columns[i] = $column;
        }

        this.listenTo(this.collection, 'add', this.collectionAdd.bind(this));
    },

    calculateWidths: function () {
        var photoWidth = 400;
        var padding = 20;
        var combinedWidth = photoWidth + padding;
        var containerWidth = this.$el.width();

        var numberOfColumns = Math.floor(containerWidth / combinedWidth);
        var remainingWidth = containerWidth - numberOfColumns * combinedWidth;

        if (remainingWidth > combinedWidth / 2) {
            numberOfColumns += 1;
        }

        var columnWidth = containerWidth / numberOfColumns;
        if (columnWidth - 2 * padding < photoWidth) {
            photoWidth = columnWidth - 2 * padding;
        }

        return {
            photoWidth: photoWidth,
            padding: padding,
            columnWidth: columnWidth,
            numberOfColumns: numberOfColumns
        };
    },

    collectionAdd: function (model) {
        var columnHeights = _.map(this.$columns, function ($column) {
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
        this.modelsLoaded = (this.modelNumber % this.perPage === 0) ? true : false;
        if (this.modelNumber === this.perPage) {
            this.infiniteScroll();
        }
    },

    infiniteScroll: function () {
        if (this.modelsLoaded) {
            var scroll = this.$el.scrollTop();
            var height = this.$el.height();
            var columnHeight = _.max(_.map(this.$columns, function ($column) {
                return $column.height();
            }));

            if (columnHeight - height - scroll < 0.2 * height) {
                this.modelsLoaded = false;
                this.collection.fetch();
            }
        }
    }
});

$(document).ready(function () {
    var photoCollection = new PhotoCollection();
    var photoCollectionView = new PhotoCollectionView({collection: photoCollection});

    photoCollection.fetch();
});
