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



	    //SRC CANVAS
	    this.srcCanvas = document.getElementById("xtkCanvas_" + this.mode);
	    console.log(this.srcCanvas);
	    //this.srcCtx = this.srcCanvas.getContext("2d");

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

	    console.log(this.ctx);
	    console.log(this.srcCanvas);


	    this.ctx.fillStyle = "#FF0000";
	    this.ctx.fillRect(0,0,150,75);
	    
	    this.ctx.drawImage(this.srcCanvas, 0, 0);
	    

	},

    });
    return ViewerWindowView;
});
