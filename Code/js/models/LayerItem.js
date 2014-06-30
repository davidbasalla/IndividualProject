//do I need require/define here?
define(function() {

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    title: 'Layer',
	    selected: true,
	    visible: true,
	    file: null,
	    fileName: 'dummyFileName',
	    type: 'scan',
	    index: 0,
	    windowLow: 0,
	    windowHigh: 100,
	    thresholdLow: 0,
	    thresholdHigh: 100,
	    windowLowOrig: 0,
	    windowHighOrig: 100,
	    thresholdLowOrig: 0,
	    thresholdHighOrig: 100,
	    indexX: 0,
	    indexY: 0,
	    indexZ: 0,
	    loaded: false,
	    opacity: 100,
	    colortable: null,
	}
    });
    return LayerItem;
});
