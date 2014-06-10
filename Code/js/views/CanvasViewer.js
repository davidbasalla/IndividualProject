//need to pass a variable here

define(function() {
    var ViewerWindowView = Backbone.View.extend({
	initialize:function(options){
	    //should really know the element here already
	    //console.log(this.$el);
	    this.currentLayer = 0;
	    this.srcCanvas = false;
	    
	},
	loadModel:function(options){

	},
	setSrcCanvas:function(index){
	    console.log('settingSrc to ' +  index);

	    //DST CANVAS
	    this.canvas = document.getElementById("canvasViewer" + this.mode);
	    this.ctx = this.canvas.getContext("2d");
	    this.srcCanvas = document.getElementById("xtkCanvas_" + this.mode);
	    //this.draw();
	},
	setCurrentLayer:function(args){
	    this.currentLayer = args;

	    //set up the cloning of canvas here...
	    //this.draw();

	},
	draw:function(){
	    //update the canvases

	    console.log('viewer.draw()');


	    console.log(this.srcCanvas);
	    console.log(this.ctx);

	    //console.log(this.ctx);
	    //console.log(this.srcCanvas);

	    //this.srcCtx = this.srcCanvas.getContext("2d");
	    //var imgData=this.srcCtx.getImageData(0,0,1000,100);
	    //console.log(imgData);
	    //this.ctx.putImageData(imgData,0,0);

	    
	    //this.ctx.fillStyle = "#FF0000";
	    //this.ctx.fillRect(20,20,10,10);
	    
	    this.ctx.drawImage(this.srcCanvas, -200, 0);

	},

    });
    return ViewerWindowView;
});
