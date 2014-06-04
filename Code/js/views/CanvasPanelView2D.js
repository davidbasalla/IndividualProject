//need to pass a variable here

define(["text!templates/CanvasPanel2D.html","views/CanvasPanelView"], function(CanvasPanelTemplate2D, CanvasPanelView) {
    var ViewerWindowView2D = CanvasPanelView.extend({
	template: _.template(CanvasPanelTemplate2D),
	initViewer:function(){

	    this.viewer = new X.renderer2D();
	    this.viewer.container = this.container;

	    if(this.mode == "X")
		this.viewer.orientation = 'X';
	    else if (this.mode == "Y")
		this.viewer.orientation = 'Y';
	    else if (this.mode == "Z")
		this.viewer.orientation = 'Z';

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
    });
    return ViewerWindowView2D;
});
