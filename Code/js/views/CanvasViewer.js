//need to pass a variable here

define(function() {
    var CanvasViewer = Backbone.View.extend({
	initialize:function(options){
	    
	    this.currentLayer = 0;
	    this.srcCanvas = null;

	    this.el = options.el;
	    this.mode = options.mode;
	    
	},
	events: {
	    'click': 'scroll',
	},
	loadModel:function(options){

	},
	setCurrentLayer:function(args){
	    this.currentLayer = args;

	    //set up the cloning of canvas here...
	    //this.draw();

	},
	scroll:function(){
	    console.log('blah');
	},
    });
    return CanvasViewer;
});
