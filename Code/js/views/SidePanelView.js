define(["views/LayersView", "views/LevelsView", "text!templates/SidePanel.html"],
       function(LayersView, LevelsView, SidePanelTemplate) {
    var SidePanelView = Backbone.View.extend({
	template: _.template(SidePanelTemplate),
	events: {
	},
	initialize:function() {
	    this.render();
	},
	render:function() {
	    this.$el.html(this.template);

	    //INIT LAYERS
	    this.layersView = new LayersView({
		el: $('#layersTab'),
	    });

	    //INIT LEVELS
	    this.levelsView = new LevelsView({
		el: $('#levelsTab'),
	    });
	},
    });
    return SidePanelView;
    
});
