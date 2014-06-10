//do I need require/define here?
define(function() {

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    title: 'Layer',
	    selected: true,
	    visible: true,
	    fileName: 'dummyFileName',
	    type: 'scan',
	    index: 0,
	    windowLow: 0,
	    windowHigh: 100,
	    thresholdLow: 0,
	    thresholdHigh: 100,
	    indexX: 0,
	    indexY: 0,
	    indexZ: 0,
	    loaded: false
	}
    });

    return LayerItem;
});
