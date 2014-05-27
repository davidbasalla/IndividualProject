// **This example illustrates the binding of DOM events to View methods.**

//what does this do?
(function($){

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    part1: 'hello',
	    part2: 'world',
	    visible: true,
	    fileName: 'dummyFileName'
	}
    });

    var LayerList = Backbone.Collection.extend({
	model: LayerItem
    });


    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	initialize: function(){
	    _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here

	    //init a file loader
	    //hide it
	    
	},
	events: {
	    //event for toggling visibility
	    'click button#loadFile': 'loadFile',
	    'click button#delete': 'deleteLayer'
	},
	render: function(){

	    var checkBoxHtml = '<input type="checkbox"></input>';
	    var fileLoadHtml = '<input type="file" id="filePicker" onchange="myFunction()"></input>';

	    var fileOpen = '<button type="button" class="btn btn-default btn-sm"\
                            id="loadFile" style="float:right"> <span class="glyphicon glyphicon-floppy-open">\
                            </span></button>';

	    var layerDelete = '<button type="button" class="btn btn-default btn-sm"\
                            id="delete" style="float:right"> <span class="glyphicon glyphicon-trash">\
                            </span></button>';

	    console.log(this.el);

	    $(this.el).addClass('list-group-item');
	    

	    $(this.el).html(checkBoxHtml + fileLoadHtml + layerDelete + fileOpen);
	    $('#filePicker', this.el).hide();

	    
	    return this; // for chainable calls, like .render().el
	},
	loadFile: function(){
	    console.log('LoadFile()');
	    $('#filePicker').trigger('click');
	},
	deleteLayer: function(){
	    console.log('DeleteLater()');
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




	    bootstrapListHtml = '<ul class="list-group" id="layerList"></ul>';
	    $('.panel-footer', this.el).append(bootstrapListHtml);

	    //<li class="list-group-item">Vestibulum at eros</li>

	    
	    this.counter = 0; // total number of items added thus far
	    this.render();
	},
	// `render()` now introduces a button to add a new list item.
	render: function(){

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

	    this.counter++;
	    var item = new LayerItem();
	    item.set({
		part2: item.get('part2') + this.counter // modify item defaults
	    });
	    this.collection.add(item);
	},

	appendItem: function(item){
	    var itemView = new LayerItemView({
		model: item
	    });
	    $('#layerList', this.el).append(itemView.render().el);
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
