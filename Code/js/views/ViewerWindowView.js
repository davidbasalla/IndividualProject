define(["views/CanvasViewer3D", "views/CanvasViewer2D","text!templates/ViewerWindow.html"], function(CanvasViewer3D, CanvasViewer2D, ViewerWindowTemplate) {
    var ViewerWindowView = Backbone.View.extend({
	el:'#viewerWindow',
	template: _.template(ViewerWindowTemplate),
	events: {
	},
	initialize:function() {
	    console.log('init()');
	    
	    //set the current layer
	    this.layerIndex = 0;

	    //should store the current model here?

	    //init the xtkViewers, set to layer 0
	    //this.initXtkViews(0);
	},
	render:function() {
	    //load the template

	    this.$el.append(this.template);
	    
	    //create the 4 different views here

	    //need to pass which CanvasSource to look at
	    var viewer1 = new CanvasViewer3D();
	    viewer1.el = '#panel3D';
	    viewer1.render();

	    var viewer2 = new CanvasViewer2D();
	    viewer2.el = '#panelX';
	    viewer2.mode = 'X';
	    viewer2.render();

	    var viewer3 = new CanvasViewer2D();
	    viewer3.el = '#panelY';
	    viewer3.mode = 'Y';
	    viewer3.render();

	    var viewer4 = new CanvasViewer2D();
	    viewer4.el = '#panelZ';
	    viewer4.mode = 'Z';
	    viewer4.render();


	    //NEED TO HIDE THE PLACEHOLDER DIV HERE
	},
	initXtkViews:function(layerIndex){

	    console.log('initXtkViews(' + layerIndex + ')');

	    /*
	    var viewer1 = new CanvasPanel3D();
	    viewer1.title = 'viewer1';
	    viewer1.mode = "3D";
	    viewer1.layerIndex = this.layerIndex;

	    var viewer2 = new CanvasPanel2D();
	    viewer2.title = 'viewer2';
	    viewer2.mode = "X";
	    viewer2.master = true;
	    viewer2.layerIndex = this.layerIndex;
	    
	    var viewer3 = new CanvasPanel2D();
	    viewer3.title = 'viewer3';
	    viewer3.mode = "Y";
	    viewer3.layerIndex = this.layerIndex;
	    
	    var viewer4 = new CanvasPanel2D();
	    viewer4.title = 'viewer4';
	    viewer4.mode = "Z";
	    viewer4.layerIndex = this.layerIndex;

	    $('#view_' + this.layerIndex, this.el).append(viewer1.render().el);
	    $('#view_' + this.layerIndex, this.el).append(viewer2.render().el);
	    $('#view_' + this.layerIndex, this.el).append(viewer3.render().el);
	    $('#view_' + this.layerIndex, this.el).append(viewer4.render().el);
	    
	    viewer1.initViewer();
	    viewer2.initViewer();
	    viewer3.initViewer();
	    viewer4.initViewer();
	    */
	},
    });
    return ViewerWindowView;
});
