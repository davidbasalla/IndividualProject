//need to pass a variable here

define(function() {
    var CanvasViewer = Backbone.View.extend({
	initialize:function(options){
	    //console.log('CanvasViewer.init()');
	    
	    this.currentLayerItemTop = null;
	    this.currentLayerItemBottom = null;
	    this.srcCanvas = null;

	    this.alphaA = 1;
	    this.alphaB = 1;
	    
	    this.el = options.el;
	    this.mode = options.mode;
	    this.viewerIndex = options.viewerIndex;
	},
	events: {
	    'click button#ThreeDtoggle': 'setModeHandler',
	    'click button#Xtoggle': 'setModeHandler',
	    'click button#Ytoggle': 'setModeHandler',
	    'click button#Ztoggle': 'setModeHandler',
	},
	setCurrentLayers:function(itemA, itemB){
	    //console.log('CanvasViewer.setCurrentLayer()');
	    
	    //console.log(itemA);
	    //console.log(itemB);
	    
	    this.currentLayerItemTop = itemA;
	    this.currentLayerItemBottom = itemB;
	    
	    this.setSrcCanvases();
	},
	setSrcCanvases:function(){
	    //console.log('CanvasViewer.setSrcCanvases()');
	    //console.log(this.currentLayerItemTop);
	    //console.log(this.currentLayerItemBottom);


	    
	    if(this.currentLayerItemTop && this.currentLayerItemBottom){
		
		//DST CANVAS
		this.canvas = document.getElementById("canvasViewer" + this.viewerIndex);
		this.ctx = this.canvas.getContext("2d");

		//SRC CANVASES
		var layerIndexTop = this.currentLayerItemTop.get('index');
		var layerIndexBtm = this.currentLayerItemBottom.get('index');
		
		this.srcCanvasA = document.getElementById("xtkCanvas_L" + layerIndexTop + "_" + this.mode);
		this.srcCanvasB = document.getElementById("xtkCanvas_L" + layerIndexBtm + "_" + this.mode);
	    }

	    //console.log(this.canvas);
	    //console.log(this.srcCanvasA);
	    //console.log(this.srcCanvasB);
	},
	setModeHandler:function(e){

	    ////console.log('e = ' + e.currentTarget.id);
	    
	    if (e.currentTarget.id == 'ThreeDtoggle')
		this.setMode(0);
	    else if (e.currentTarget.id == 'Xtoggle')
		this.setMode(1);
	    else if (e.currentTarget.id == 'Ytoggle')
		this.setMode(2);
	    else if (e.currentTarget.id == 'Ztoggle')
		this.setMode(3);
	},
	setMode:function(mode){
	    ////console.log('setMode(' + mode + ')');

	    $($(ThreeDtoggle, this.el)[this.viewerIndex]).removeClass('layer-selected');
	    $($(Xtoggle, this.el)[this.viewerIndex]).removeClass('layer-selected');
	    $($(Ytoggle, this.el)[this.viewerIndex]).removeClass('layer-selected');
	    $($(Ztoggle, this.el)[this.viewerIndex]).removeClass('layer-selected');

	    var currentTarget;
	    if(mode == 0)
		currentTarget = $($(ThreeDtoggle, this.el)[this.viewerIndex]);
	    else if(mode == 1)
		currentTarget = $($(Xtoggle, this.el)[this.viewerIndex]);
	    else if(mode == 2)
		currentTarget = $($(Ytoggle, this.el)[this.viewerIndex]);
	    else if(mode == 3)
		currentTarget = $($(Ztoggle, this.el)[this.viewerIndex]);

	    currentTarget.addClass('layer-selected');

	    this.mode = mode;
	    this.setSrcCanvases();
	},
    });
    return CanvasViewer;
});
