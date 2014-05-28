// **This example illustrates the binding of DOM events to View methods.**

//what does this do?
(function($){

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    part1: 'hello',
	    part2: 'world',
	    visible: true,
	    fileName: 'dummyFileName',
	    type: 'scan'
	}
    });

    var LayerList = Backbone.Collection.extend({
	model: LayerItem
    });

    var LayerItemView = Backbone.View.extend({
	tagName: 'li', // name of (orphan) root tag in this.el
	initialize: function(){
	    //_.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
	    console.log('this.el =');
	    console.log($(this.el));
	    //console.log(this.el);
	    console.log(this.$el);
	    console.log(this);
	},
	events: {
	    //event for toggling visibility
	    'click button#loadFile': 'loadFile',
	    'click button#delete': 'deleteLayer',
	    'change input#checkBox': 'toggleVisibility',
	    'change input#filePicker': 'fileLoaded',
	    'change input#labelPicker': 'labelLoaded',
	    'click a#addLabelMap': 'addLabelMap',
	},
	render: function(){

	    // THESE NEED TO GO INTO A TEMPLATE
	    var checkBoxHtml = '<input type="checkbox" id="checkBox" checked></input>';
	    var fileLoadHtml = '<input type="file" id="filePicker"></input>';
	    var labelLoadHtml = '<input type="file" id="labelPicker"></input>';

	    var textHolder = '<span id="textHolder">Layer</span>';
	    
	    var fileOpen = '<button type="button" class="btn btn-default btn-sm"\
                           id="loadFile"> <span class="glyphicon glyphicon-floppy-open">\
                           </span></button>';

	    var layerDelete = '<button type="button" class="btn btn-default btn-sm"\
                            id="delete"> <span class="glyphicon glyphicon-trash">\
                            </span></button>';

	    var dropDown = '<div class="btn-group">\
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="padding-top:9px; padding-bottom:9px">\
 	                    <span class="caret"></span>\
                            </button>\
                            <ul class="dropdown-menu" role="menu">\
	                    <li><a href="#" id="addLabelMap">Add Labelmap</a></li>\
	                    <li class="divider"></li>\
	                    <li><a href="#">Separated link</a></li>\
                            </ul>\
                            </div>';

	    //add style to rendering of the layer item
	    $(this.el).addClass('list-group-item');
	    
	    //create hidden file loader for file loading mechanics
	    $(this.el).html(checkBoxHtml + textHolder + fileLoadHtml + labelLoadHtml + '<div class="btn-group" style="float:right">' + fileOpen + layerDelete + dropDown + '</div>');
	    $('#filePicker', this.el).hide();
	    $('#labelPicker', this.el).hide();

	    return this; // for chainable calls, like .render().el


	},
	loadFile: function(){
	    //trigger the hidden fileLoader
	    $('#filePicker',this.el).trigger('click');
	},
	loadLabelMap: function(){
	    //trigger the hidden fileLoader
	    $('#labelPicker',this.el).trigger('click');
	},
	fileLoaded: function(e){
	    //add text to layer preview
	    $('#textHolder', this.el).html(e.currentTarget.files[0].name);

	    //call draw function
	    loadScan(e.currentTarget.files[0]);
	},
	labelLoaded: function(e){
	    //add text to layer preview
	    //$('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    //call draw function
	    loadLabelMap(e.currentTarget.files[0]);
	},
	toggleVisibility: function(e){
	    console.log('ToggleVisibility');
	    this.model.attributes.visible = e.target.checked;
	},	
	deleteLayer: function(){
	    $(this.el).remove();
	},
	addLabelMap: function(){
	    console.log('addLabelMap');
	    console.log($(this.el));
	    //console.log($(this.el.parentElement));
	    //$('#layerList', this.el.parentElement).append('<li>TEST</li>')
	    //$(this.el.parentElement).append('<li>TEST</li>')
	    this.loadLabelMap();
	},
    });

    var LayerListView = Backbone.View.extend({
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
	    console.log($(this.el));
	},

	appendItem: function(item){
	    var itemView = new LayerItemView({
		model: item
	    });
	    $('#layerList', this.el).append(itemView.render().el);
	}
    });

    var layerView = new LayerListView();
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
