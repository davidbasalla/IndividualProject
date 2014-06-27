//need to pass a variable here

define(function() {
    var CanvasViewer = Backbone.View.extend({
	initialize:function(options){
	    //console.log('CanvasViewer.init()');
	    
	    _.bindAll(this, 'setMode');

	    this.currentLayerItemTop = null;
	    this.currentLayerItemBottom = null;
	    this.srcCanvas = null;

	    this.showOverlay = false;
	    this.showLine = false;
	    this.swipeMode = 0;
	    
	    this.alphaA = 1;
	    this.alphaB = 1;
	    
	    this.el = options.el;
	    this.mode = options.mode;
	    this.viewerIndex = options.viewerIndex;
	    
	    this.ALoaded = false; //for telling if file is loaded
	    this.BLoaded = false; //for telling if file is loaded

	    //not currently used
	    this.mouseDown = false;


	    //LINE POINTS
	    this.lineStartX = 0;
	    this.lineEndX = 50;
	    this.lineStartY= 0;
	    this.lineEndY = 50;
	    this.clipPosX = 0;
	    this.clipPosY = 0;

	    this.mouseXPrev = 0;
	    this.mouseYPrev = 0;
	    this.mouseZPrev = 0;

	    this.mouseDown = false;
	    
	    //DISABLE MIDDLE MOUSE FOR THIS ELEMENT
	    $(this.el).mousedown(function(e){if(e.button==1)return false});
	    $(this.el).mousedown(function(e){
		console.log(e);
		if(e.button==2)
		    return false
	    });
	    $('body').on('contextmenu', this.el, function(e){ return false; });
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

	    console.log('setModeHandler');
	    console.log('e = ' + e.currentTarget.id);
	    
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
	    console.log('setMode(' + mode + ')');


	    this.$el.find("#ThreeDtoggle").removeClass('layer-selected');
	    this.$el.find("#Xtoggle").removeClass('layer-selected');	    
	    this.$el.find("#Ytoggle").removeClass('layer-selected');
	    this.$el.find("#Ztoggle").removeClass('layer-selected');

	    var currentTarget;
	    if(mode == 0)
		currentTarget = this.$el.find("#ThreeDtoggle");
	    else if(mode == 1)
		currentTarget = this.$el.find("#Xtoggle");
	    else if(mode == 2)
		currentTarget = this.$el.find("#Ytoggle");
	    else if(mode == 3)
		currentTarget = this.$el.find("#Ztoggle");

	    currentTarget.addClass('layer-selected');

	    this.mode = mode;
	    this.setSrcCanvases();
	},
    });
    return CanvasViewer;
});
