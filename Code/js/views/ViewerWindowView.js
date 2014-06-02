define(["views/CanvasPanelView"], function(CanvasPanel) {
    var ViewerWindowView = Backbone.View.extend({
	el:'#viewerWindow',
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?
	    //this.layout = type of layout

	    this.layer = "";

	    Backbone.on('setSelected', this.toggleVisibility, this);
	},
	render:function() {

	    //should actually create a panel view here
	    //and call the render function for it


	    //insert a div for the current layer
	    
	    this.$el.append('<div id="view_' + this.layer + '"></div>');

	    var viewer1 = new CanvasPanel();
	    viewer1.title = 'viewer1';
	    viewer1.mode = "3D";
	    viewer1.layer = this.layer;

	    var viewer2 = new CanvasPanel();
	    viewer2.title = 'viewer2';
	    viewer2.mode = "X";
	    viewer2.master = true;
	    viewer2.layer = this.layer;
	    
	    var viewer3 = new CanvasPanel();
	    viewer3.title = 'viewer3';
	    viewer3.mode = "Y";
	    viewer3.layer = this.layer;
	    
	    var viewer4 = new CanvasPanel();
	    viewer4.title = 'viewer4';
	    viewer4.mode = "Z";
	    viewer4.layer = this.layer;

	    $('#view_' + this.layer, this.el).append(viewer1.render().el);
	    $('#view_' + this.layer, this.el).append(viewer2.render().el);
	    $('#view_' + this.layer, this.el).append(viewer3.render().el);
	    $('#view_' + this.layer, this.el).append(viewer4.render().el);
	    
	    viewer1.initViewer();
	    viewer2.initViewer();
	    viewer3.initViewer();
	    viewer4.initViewer();
	},
	toggleVisibility:function(layer){
	    
	    if(this.layer == layer)
		$('#view_' + this.layer).show();
	    else
		$('#view_' + this.layer).hide();
	    
	},
    });
    return ViewerWindowView;
});
