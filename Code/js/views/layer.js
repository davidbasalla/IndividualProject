// **This example illustrates the binding of DOM events to View methods.**

//what does this do?
(function($){

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    part1: 'hello',
	    part2: 'world'
	}
    });

    var LayerList = Backbone.Collection.extend({
	model: LayerItem
    });


    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	initialize: function(){
	    _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
	},
	render: function(){
	    $(this.el).html('<span>'+this.model.get('part1')+' '+this.model.get('part2')+'</span>');
	    return this; // for chainable calls, like .render().el
	}
    });


    
    var LayerView = Backbone.View.extend({
	el: $('body'), // el attaches to existing element
	
	// `events`: Where DOM events are bound to View methods. Backbone doesn't have a separate controller to handle such bindings; it all happens in a View.
	events: {
	    'click button#add': 'addItem'
	},
	initialize: function(){
	    //do I need this?
	    console.log('Init');

	    //_.bindAll(this, 'render', 'addItem'); // every function that uses 'this' as the current object should be in here

	    this.collection = new LayerList();
	    this.collection.bind('add', this.appendItem); // collection event binder
	    
	    this.counter = 0; // total number of items added thus far
	    this.render();
	},
	// `render()` now introduces a button to add a new list item.
	render: function(){

	    console.log(this.el);
	    console.log($("div", this.el));
	    


	    $('#layers', this.el).append("<button type=\"button\" \
                                         class=\"btn btn-default btn-sm\"\
                                         id=\"add\" style=\"float:right\">\
                                         <span class=\"glyphicon glyphicon-plus\">\
                                         </span></button>");
	    
	    //$(this.el).append("<ul></ul>");
	},
	// `addItem()`: Custom function called via `click` event above.
	addItem: function(){
	    console.log("adding layer");

	    //need to add a layerItem here

	    this.counter++;
	    var item = new LayerItem();
	    item.set({
		part2: item.get('part2') + this.counter // modify item defaults
	    });
	    console.log(item);
	    this.collection.add(item);
	},

	appendItem: function(item){
	    var itemView = new LayerItemView({
		model: item
	    });
	    $('.panel-footer', this.el).append(itemView.render().el);
	}
	
	
    });

    var layerView = new LayerView();
})(jQuery);

/*
//////////////////////////////////////////


layerList

layerItem


layerItem consists of 
- checkbox
- chose file button
- delete button

needs to be stored
*/
