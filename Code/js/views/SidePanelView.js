define(["models/LayersItem", "views/LayersView", "views/LevelsView", "text!templates/SidePanel.html"],
       function(LayersItem, LayersView, LevelsView, SidePanelTemplate) {
	   var SidePanelView = Backbone.View.extend({
	       template: _.template(SidePanelTemplate),
	       events: {
	       },
	       initialize:function(options) {
		   this.layersModel = options.layersModel;
		   this.viewerWindowView = options.viewerWindowView;

		   this.render();
	       },
	       render:function() {
		   this.$el.html(this.template);

		   //INIT LAYERS MODEL TO KEEP TRACK OF CHANGES
		   var layersModel = new LayersItem();

		   //INIT LEVELS
		   this.levelsView = new LevelsView({
		       el: $('#levelsTab'),
		       layersModel: this.layersModel,
		   });

		   //INIT LAYERS
		   this.layersView = new LayersView({
		       el: $('#layersTab'),
		       layersModel: this.layersModel,
		       levelsView: this.levelsView,
		       viewerWindowView: this.viewerWindowView,
		   });

	       },
	       toggleBuffer:function(index){
		   this.layersView.setBuffer(index);
	       },
	   });
	   return SidePanelView;
	   
       });
