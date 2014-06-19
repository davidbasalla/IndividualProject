//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer"], function(CanvasViewer2DTemplate, CanvasViewer) {
    var CanvasViewer2D = CanvasViewer.extend({
	template: _.template(CanvasViewer2DTemplate),
	events: function(){
	    return _.extend({}, CanvasViewer.prototype.events,{
		'mousewheel': 'scroll',
		'change input#overlayCheckbox': 'toggleOverlay'
	    });
	},
	/*
	events: {
	    'change input#overlayCheckbox': 'toggleOverlay',
	},
	*/
	toggleOverlay:function(e){

	    console.log('CanvasViewer2D.toggleOverlay()');
	    if (!this.showOverlay)
		this.showOverlay = true;
	    else
		this.showOverlay = false;
	},
	render:function() {
	    //console.log('CanvasViewer2D.render()');

	    //_.bindAll(this, 'draw');
	    
	    ////console.log($(this.el));
	    
	    $(this.el).html(this.template({
		overlay: 'overlayToggle' + this.mode,
		canvasViewerId: 'canvasViewer' + this.mode,
		slider: 'sliderVertical' + this.mode,
	    }));
	    return this; //to enable chain calling
	},
	setOpacity:function(){

	    if(this.ctx){
		this.alphaA = this.currentLayerItemTop.get('opacity')/100;
		this.alphaB = this.currentLayerItemBottom.get('opacity')/100;
	    };
	},
	draw:function(){
	    //update the canvases at 60 frames a second?

	    ////console.log('CanvasViewer2D.draw(' + this.mode + ')');


	    //CLEAR - NEED TO FIX THESE COORDS
	    this.ctx.fillStyle = 'black';
	    this.ctx.clearRect(0,0,1000,1000);

	    //DRAW BLACK BACKGROUND - SO ALWAYS A BLACK BACKGROUND
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillRect(0,0,1000,1000);
	    
	    //SET FIRST ALPHA
	    this.ctx.globalAlpha = this.alphaB;


	    //DRAW BOTTOM CANVAS
	    if(this.currentLayerItemBottom){
		if(this.currentLayerItemBottom.get('loaded'))
		    this.ctx.drawImage(this.srcCanvasB, 0, 0);
	    }


	    //SET SECOND ALPHA
	    this.ctx.globalAlpha = this.alphaA;

	    //DRAW BLACK BACKGROUND FOR ITEM_TOP
	    this.ctx.fillRect(0,0,1000,1000);
	    //DRAW TOP CANVAS
	    if(this.currentLayerItemTop){
		if(this.currentLayerItemTop.get('loaded'))
		    this.ctx.drawImage(this.srcCanvasA, 0, 0);
	    }

	    //do the overlay
	    if(this.showOverlay){
		this.drawOverlay();

	    }
	},
	drawOverlay:function(){
	    /* displays info about the current layerItem */
	    
	    //reset globalAlpha
	    this.ctx.globalAlpha = 1;
	    this.ctx.fillStyle = 'white';
	    this.ctx.font="14px Arial";

	    //FILENAME
	    this.ctx.fillText("File: " + this.currentLayerItemTop.get('fileName').name,10,20);

	    //INDEX
	    var index = 0;
	    if (this.mode == 1)
		index = this.currentLayerItemTop.get('indexX');
	    else if (this.mode == 2)
		index = this.currentLayerItemTop.get('indexY');
	    else if (this.mode == 3)
		index = this.currentLayerItemTop.get('indexZ');

	    this.ctx.fillText("Index: " + index,10,40);

	    //OPAC
	    this.ctx.fillText("Opacity: " + this.currentLayerItemTop.get('opacity'),10,60);

	},
	scroll:function(e){
	    
	    //X
	    if (this.mode == 1){
	    	var oldVal = this.currentLayerItemTop.get('indexX');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentLayerItemTop.set({indexX: oldVal - 1});
		else
		    this.currentLayerItemTop.set({indexX: oldVal + 1});
	    }
	    //Y
	    else if (this.mode == 2){
	    	var oldVal = this.currentLayerItemTop.get('indexY');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentLayerItemTop.set({indexY: oldVal - 1});
		else
		    this.currentLayerItemTop.set({indexY: oldVal + 1});
	    }
	    //Z
	    else if (this.mode == 3){
	    	var oldVal = this.currentLayerItemTop.get('indexZ');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentLayerItemTop.set({indexZ: oldVal - 1});
		else
		    this.currentLayerItemTop.set({indexZ: oldVal + 1});
	    }

	},
    });
    return CanvasViewer2D;
});
