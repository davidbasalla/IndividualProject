//do I need require/define here?
define(function() {

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    title: 'Layer',
	    selected: true,
	    visible: true,
	    fileName: 'dummyFileName',
	    type: 'scan'
	}
    });

    return LayerItem;
});
