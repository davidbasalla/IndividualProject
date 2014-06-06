//need to pass a variable here

define(["text!templates/XTK.html"], function(XTKTemplate) {
    var XtkView = Backbone.View.extend({
	el: '#xtkPanels',
	template: _.template(XTKTemplate),
	events: {
	},
	initialize:function(options) {
	    console.log('initXTK()');
	    this.layerIndex = options.layerIndex;
	    this.render();

	},
	render:function() {
	    console.log('render()');
	    console.log(this.el);
	    console.log(this.$el);

	    this.$el.append(this.template({layerIndex: 'xtkViewer_L' + this.layerIndex}));
	    this.initViewers();
	},
	initViewers:function(){
	    //create all 4 viewers

	    //need to set the attribs of the xtkViewer_L id"

	    //set width and height according to original canvas, need to update the size!!
	    var height = $("#canvasViewer3D").height();
	    var width = $("#canvasViewer3D").width();
	    
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.width = width;
	    document.getElementById("xtkViewer_L" + this.layerIndex).style.height = height;
	    
	    this.viewer3D = new X.renderer3D();
	    this.viewerX = new X.renderer2D();
	    this.viewerY = new X.renderer2D();
	    this.viewerZ = new X.renderer2D();
	    
	    this.viewer3D.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerX.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerY.container = 'xtkViewer_L' + this.layerIndex;
	    this.viewerZ.container = 'xtkViewer_L' + this.layerIndex;
	    
	    this.viewerX.orientation = 'X';
	    this.viewerY.orientation = 'Y';
	    this.viewerZ.orientation = 'Z';

	    this.viewer3D.init();
	    this.viewerX.init();
	    this.viewerY.init();
	    this.viewerZ.init();


	    //set x to be the master viewer
	},
	loadFile:function(){
	    //do file stuff, load it into the master viewer
	},
    });
    return XtkView;
});
