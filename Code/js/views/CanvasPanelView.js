//need to pass a variable here

define(["text!templates/CanvasPanel.html"], function(CanvasPanelTemplate) {
    var ViewerWindowView = Backbone.View.extend({
	template: _.template(CanvasPanelTemplate),
	events: {
	},
	initialize:function() {
	    //possible vars, should these be in a model?

	    this.title = "";
	    this.container = "";
	    //this.layer
	    //this.view
	    
	},
	render:function() {
	    this.$el.html(this.template({title: this.title, container: this.container}));

	    // create the 2D renderers

	    /*
	    this.sliceX = new X.renderer2D();
	    this.sliceX.container = this.title;
	    this.sliceX.orientation = 'X';
	    this.sliceX.init();
	    */

	    return this; //to enable chain calling
	},
    });
    return ViewerWindowView;
});
