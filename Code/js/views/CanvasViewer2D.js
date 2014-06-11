//need to pass a variable here

define(["text!templates/CanvasViewer2D.html","views/CanvasViewer"], function(CanvasViewer2DTemplate, CanvasViewer) {
    var CanvasViewer2D = CanvasViewer.extend({
	template: _.template(CanvasViewer2DTemplate),
	render:function() {
	    console.log($(this.el));
	    
	    $(this.el).html(this.template({
		overlay: 'overlayToggle' + this.mode,
		canvasViewerId: 'canvasViewer' + this.mode,
		slider: 'sliderVertical' + this.mode,
	    }));
	    $( "#sliderVertical" + this.mode, this.el ).slider({
		orientation: "vertical",
		//range: "min",
		min: 0,
		max: 100,
		value: 50,
		slide: function( event, ui ) {
		    $( "#amount" ).val( ui.value );
		}
	    });
	    return this; //to enable chain calling
	},
	setSrcCanvas:function(index){
	    console.log('settingSrc to ' +  index);

	    //DST CANVAS
	    this.canvas = document.getElementById("canvasViewer" + this.mode);
	    this.ctx = this.canvas.getContext("2d");
	    this.srcCanvas = document.getElementById("xtkCanvas_" + this.mode);
	},
	draw:function(){
	    //update the canvases

	    //this.ctx.clearRect(0,0,1000,200);

	    //copy image
	    this.ctx.drawImage(this.srcCanvas, 0, 0);

	    /*
	    //do the overlay
	    this.ctx.fillStyle = 'white';
	    this.ctx.font="14px Arial";
	    this.ctx.fillText("Index: ",10,20);*/
	},
    });
    return CanvasViewer2D;
});
