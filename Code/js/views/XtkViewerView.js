define(["text!templates/XtkViewer.html"], function(XtkViewerTemplate) {
	var XtkViewerView = Backbone.View.extend({
		template: _.template(XtkViewerTemplate),
		events: {
		},
		initialize:function() {
		},
		render:function() {
			this.$el.html(this.template);
		},
	});
    return XtkViewerView;
    
});
