define(["text!templates/NavBar.html"], function(NavBarTemplate) {

    var NavBarView = Backbone.View.extend({
	template: _.template(NavBarTemplate),
	events: {
	},
	initialize:function() {
	    this.render();
	},
	render:function() {
	    this.$el.html(this.template);
	},
    });

    
    return NavBarView;
    
});
