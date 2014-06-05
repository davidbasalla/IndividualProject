//need to pass a variable here

define(["text!templates/CanvasPanel2D.html","views/CanvasPanelView"], function(CanvasPanelTemplate2D, CanvasPanelView) {
    var ViewerWindowView2D = CanvasPanelView.extend({
	template: _.template(CanvasPanelTemplate2D),
	events: {
	    'change input#overlayX': 'setOverlay',
	    'change input#overlayY': 'setOverlay',
	    'change input#overlayZ': 'setOverlay',
	},
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

	    if(this.mode == "X"){
		var canv = $($('canvas')[1]);
		var canvCopy = $($('canvas')[2]);
		canv.attr({
		    'id':'canvasX',
		});
		canv.hide()
		canvCopy.attr({
		    'id':'canvasX_copy',
		});
	    }
	    else if (this.mode == "Y"){
		var canv = $($('canvas')[3]);
		canv.attr({
		    'id':'canvasY',
		});
	    }
	    else if (this.mode == "Z"){
		var canv = $($('canvas')[5]);
		canv.attr({
		    'id':'canvasZ',
		});
	    }
	    

	    //set up copyCanvas
	    this.c = document.getElementById('canvasX');
	    this.cCopy = document.getElementById('canvasX_copy');
	    this.ctx = this.cCopy.getContext("2d");

	    
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

	    Backbone.on('sliceIndexChanged', this.updateCanvas, this);
	},
	updateCanvas: function(){

	    this.ctx.clearRect(0,0,2000,2000);
	    this.ctx.drawImage(this.c, 0, 0);

	    
	    this.ctx.font="20px Georgia"
	    this.ctx.fillStyle = 'white';
	    this.ctx.fillText("Hello World!",20,20);
	},
    });
    return ViewerWindowView2D;
});
