define(["text!templates/Layers.html"], function(LayersTemplate) {

	var LayersView = Backbone.View.extend({
		template: _.template(LayersTemplate),
		events: {
		},
		initialize:function() {
		},
		render:function() {
			this.$el.html(this.template);
		},
	});

    
    return LayersView;
    
});
