define(["views/CanvasPanelView"], function(CanvasPanel) {
    var ViewerWindowView = Backbone.View.extend({
	el:'#viewerWindow',
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?
	    //this.layout = type of layout

	    this.layerIndex = 0;

	    Backbone.on('setSelected', this.toggleVisibility, this);
	    Backbone.on('layerRemoved', this.remove, this);
	},
	render:function() {

	    //should actually create a panel view here
	    //and call the render function for it


	    //insert a div for the current layer
	    
	    this.$el.append('<div id="view_' + this.layerIndex + '"></div>');

	    var viewer1 = new CanvasPanel();
	    viewer1.title = 'viewer1';
	    viewer1.mode = "3D";
	    viewer1.layerIndex = this.layerIndex;

	    var viewer2 = new CanvasPanel();
	    viewer2.title = 'viewer2';
	    viewer2.mode = "X";
	    viewer2.master = true;
	    viewer2.layerIndex = this.layerIndex;
	    
	    var viewer3 = new CanvasPanel();
	    viewer3.title = 'viewer3';
	    viewer3.mode = "Y";
	    viewer3.layerIndex = this.layerIndex;
	    
	    var viewer4 = new CanvasPanel();
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
	},
	toggleVisibility:function(layerIndex){
	    
	    if(this.layerIndex == layerIndex)
		$('#view_' + this.layerIndex).show();
	    else
		$('#view_' + this.layerIndex).hide();
	    
	},
	remove:function(layerIndex){
	    if(this.layerIndex == layerIndex)
		$('#view_' + this.layerIndex).remove();
	},
    });
    return ViewerWindowView;
});
