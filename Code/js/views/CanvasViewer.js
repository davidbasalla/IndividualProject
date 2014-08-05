//need to pass a variable here

define(function() {
    var CanvasViewer = Backbone.View.extend({
	initialize:function(options){
	    //console.log('CanvasViewer.init()');

	    _.bindAll(this, 'render');

	    this.currentLayerItemTop = null;
	    this.currentLayerItemBottom = null;
	    this.srcCanvas = null;

	    this.showOverlay = false;
	    this.showLine = false;
	    this.doVolumeRender = false;
	    this.swipeMode = 0;
	    
	    this.alphaA = 1;
	    this.alphaB = 1;
	    
	    this.el = options.el;
	    this.mode = options.mode;
	    this.panelId = options.viewerId;

	    this.panelId = options.panelId;
	    this.viewerWindowView = options.viewerWindowView;
	    
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

	    this.mouseX = 0;
	    this.mouseY = 0;

	    this.mouseDown = false;
	    this.traversing = false;

	    this.annotation = false;

	    _.bindAll(this, 'mouseWheelHandler');
	    
	    //DISABLE MIDDLE MOUSE FOR THIS ELEMENT
	    $(this.el).mousedown(function(e){if(e.button==1)return false});
	    $(this.el).mousedown(function(e){
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
	setPanel:function(panel){
	    /* NEW - for reassigning el and $el */

	    //this.setElement(panel); - this does weird things
	    this.el = panel;
	    this.$el = $(panel);

	},
	setCurrentLayers:function(itemA, itemB){
	    console.log('CanvasViewer.setCurrentLayers()');
	    
	    this.currentLayerItemTop = itemA;
	    this.currentLayerItemBottom = itemB;

	    this.setSrcCanvases();
	},
	setSrcCanvases:function(){
	    console.log('CanvasViewer.setSrcCanvases()');
	    console.log('MODE = ' + this.mode);

	    //console.log(this.currentLayerItemTop);
	    //console.log(this.currentLayerItemBottom);

	    if(this.currentLayerItemTop && this.currentLayerItemBottom){
		
		//SRC CANVASES
		var layerIndexTop = this.currentLayerItemTop.get('index');
		var layerIndexBtm = this.currentLayerItemBottom.get('index');
		
		this.srcCanvasA = document.getElementById("xtkCanvas_L" + layerIndexTop + "_" + this.mode);
		this.srcCanvasB = document.getElementById("xtkCanvas_L" + layerIndexBtm + "_" + this.mode);
	    }
	},
	setModeHandler:function(e){

	    console.log('CanvasView.setModelHandler()');

	    console.log(this);
	    console.log('MODE = ' + this.mode);
	    console.log('EL = ' + this.el);
	    console.log('E.DELTARGET.ID = ' + e.delegateTarget.id);
	    console.log(e);


	    var srcIndex = this.mode;
	    //var srcPanel = this.el;
	    var srcPanel = '#' + e.delegateTarget.id; //for some reason the buttons get confused

	    var dstIndex = 0;

	    if (e.currentTarget.id == 'ThreeDtoggle')
		var dstIndex = 0;
	    else if (e.currentTarget.id == 'Xtoggle')
		var dstIndex = 1;
	    else if (e.currentTarget.id == 'Ytoggle')	
		var dstIndex = 2;	    
	    else if (e.currentTarget.id == 'Ztoggle')
		var dstIndex = 3;

	    this.viewerWindowView.resetPanels(srcPanel, dstIndex);

	},
	setModeCSS:function(){
	    console.log('setMode(' + this.mode + ')');

	    this.$el.find("#ThreeDtoggle").removeClass('layer-selected');
	    this.$el.find("#Xtoggle").removeClass('layer-selected');	    
	    this.$el.find("#Ytoggle").removeClass('layer-selected');
	    this.$el.find("#Ztoggle").removeClass('layer-selected');

	    var currentTarget;
	    if(this.mode == 0)
		currentTarget = this.$el.find("#ThreeDtoggle");
	    else if(this.mode == 1)
		currentTarget = this.$el.find("#Xtoggle");
	    else if(this.mode == 2)
		currentTarget = this.$el.find("#Ytoggle");
	    else if(this.mode == 3)
		currentTarget = this.$el.find("#Ztoggle");

	    currentTarget.addClass('layer-selected');
	},
    });
    return CanvasViewer;
});
