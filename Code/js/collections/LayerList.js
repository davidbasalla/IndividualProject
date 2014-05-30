//do I need require/define here?
define(['models/LayerItem'], function(LayerItem) {

    var LayerList = Backbone.Collection.extend({
	model: LayerItem
    });

    return LayerList;
});
