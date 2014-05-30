define(["text!templates/NavBar.html"], function(NavBarTemplate) {

	var NavBarView = Backbone.View.extend({
		template: _.template(NavBarTemplate),
		events: {
		},
		initialize:function() {
		},
		render:function() {
			this.$el.html(this.template);
		},
	});

    
    return NavBarView;
    
});
