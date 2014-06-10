//do I need require/define here?
define(function() {

    var LayersItem = Backbone.Model.extend({
	defaults: {
	    currentLayer: false,
	    currentItem: false
	}
    });

    return LayersItem;
});
