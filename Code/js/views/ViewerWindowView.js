define(["views/CanvasPanelView"], function(CanvasPanel) {
    var ViewerWindowView = Backbone.View.extend({
	el:'#viewerWindow',
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?

	    //this.layout = type of layout
	},
	render:function() {

	    //should actually create a panel view here
	    //and call the render function for it

	    var viewer1 = new CanvasPanel();
	    viewer1.title = 'viewer1';
	    viewer1.container = "slice3D";

	    var viewer2 = new CanvasPanel();
	    viewer2.title = 'viewer2';
	    viewer2.container = "sliceX";

	    var viewer3 = new CanvasPanel();
	    viewer3.title = 'viewer3';
	    viewer3.container = "sliceY";

	    var viewer4 = new CanvasPanel();
	    viewer4.title = 'viewer4';
	    viewer4.container = "sliceZ";

	    
	    this.$el.append(viewer1.render().el);
	    this.$el.append(viewer2.render().el);
	    this.$el.append(viewer3.render().el);
	    this.$el.append(viewer4.render().el);
	    
	},
    });
    return ViewerWindowView;
});
