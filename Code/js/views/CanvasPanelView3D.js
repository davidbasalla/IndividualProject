//need to pass a variable here

define(["text!templates/CanvasPanel3D.html","views/CanvasPanelView"], function(CanvasPanelTemplate3D, CanvasPanelView) {
    var ViewerWindowView3D = CanvasPanelView.extend({
	template: _.template(CanvasPanelTemplate3D),
	events: {
	    'click button#button': 'setVolumeRender',
	    'change input#volumeRender': 'setVolumeRender',
	},
	initViewer:function(){
	    // create the viewer
	    this.viewer = new X.renderer3D();
	    this.viewer.container = this.container;
	    this.viewer.init();

	    if(this.master){
		_this = this;
		this.viewer.onShowtime = function() {
		    
		    _this.originalThresholdLow = _this.volume.lowerThreshold;
		    _this.originalThresholdHigh = _this.volume.upperThreshold;

		    _this.originalWindowLow = _this.volume.windowLow;
		    _this.originalWindowHigh = _this.volume.windowHigh;
		    
		    Backbone.trigger('onShowtime',  [_this.volume, _this.layerIndex]);
		}
	    };
	},
	setVolumeRender: function(e){
	    console.log('triggering...');
	    Backbone.trigger('setVolumeRendering', [this.layerIndex, e.target.checked]);
	},
    });
    return ViewerWindowView3D;
});