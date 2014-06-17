//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer"], function(CanvasViewer2DTemplate, CanvasViewer) {
    var CanvasViewer2D = CanvasViewer.extend({
	template: _.template(CanvasViewer2DTemplate),
	events: function(){
	    return _.extend({}, CanvasViewer.prototype.events,{
		'mousewheel': 'scroll',
	    });
	},
	render:function() {
	    console.log('CanvasViewer2D.render()');

	    //_.bindAll(this, 'draw');
	    
	    //console.log($(this.el));
	    
	    $(this.el).html(this.template({
		overlay: 'overlayToggle' + this.mode,
		canvasViewerId: 'canvasViewer' + this.mode,
		slider: 'sliderVertical' + this.mode,
	    }));
	    return this; //to enable chain calling
	},
	draw:function(){
	    //update the canvases


	    //console.log('CanvasViewer2D.draw(' + this.mode + ')');
	    //console.log(this);
	    //console.log(this.srcCanvas);

	    this.ctx.clearRect(0,0,1000,200);

	    //copy image
	    this.ctx.drawImage(this.srcCanvas, 0, 0);


	    //do the overlay
	    this.ctx.fillStyle = 'white';
	    this.ctx.font="14px Arial";
	    this.ctx.fillText("Index: ",10,20);
	},
	scroll:function(e){
	    
	    //X
	    if (this.mode == 1){
	    	var oldVal = this.currentItem.get('indexX');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentItem.set({indexX: oldVal - 1});
		else
		    this.currentItem.set({indexX: oldVal + 1});
	    }
	    //Y
	    else if (this.mode == 2){
	    	var oldVal = this.currentItem.get('indexY');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentItem.set({indexY: oldVal - 1});
		else
		    this.currentItem.set({indexY: oldVal + 1});
	    }
	    //Z
	    else if (this.mode == 3){
	    	var oldVal = this.currentItem.get('indexZ');
		
		if(e.originalEvent.wheelDelta < 0)
		    this.currentItem.set({indexZ: oldVal - 1});
		else
		    this.currentItem.set({indexZ: oldVal + 1});
	    }

	},
    });
    return CanvasViewer2D;
});
