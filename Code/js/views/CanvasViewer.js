//need to pass a variable here

define(function() {
    var CanvasViewer = Backbone.View.extend({
	initialize:function(options){
	    console.log('CanvasViewer.init()');
	    
	    this.currentLayer = 0;
	    this.srcCanvas = null;

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
	setCurrentLayer:function(args){
	    this.currentLayer = args;
	},
	setModeHandler:function(e){

	    //console.log('e = ' + e.currentTarget.id);
	    
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
	    this.setSrcCanvas();
	},
	setCurrentItem:function(item){
	    this.currentItem = item;
	    this.setSrcCanvas();
	},
	setSrcCanvas:function(){
	    //console.log('settingSrc');

	    //DST CANVAS
	    this.canvas = document.getElementById("canvasViewer" + this.viewerIndex);

	    //do not get context for 3D
	    
	    this.ctx = this.canvas.getContext("2d");

	    this.srcCanvas = document.getElementById("xtkCanvas_" + this.mode);
	},
    });
    return CanvasViewer;
});
