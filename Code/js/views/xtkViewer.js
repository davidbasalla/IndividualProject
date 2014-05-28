//file for handling the XTK views

//what does this do?
(function($){

    var XtkViewerView = Backbone.View.extend({
	el: $('body'), // el attaches to existing element
	initialize: function(){
	    //_.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
	    console.log('this.el =');
	    console.log($(this.el));
	    //console.log(this.el);
	    console.log(this.$el);
	    console.log(this);
	},
	events: {
	    //events
	},
	render: function(){

	},
	fileLoaded: function(e){

	},
    });

    var xtkView = new XtkViewerView();
})(jQuery);

