define(["text!templates/Layers.html", "views/LayerItemView", "models/LayerItem", "collections/LayerList"], function(LayersTemplate, LayerItemView, LayerItem, LayerList) {
    
    var LayersView = Backbone.View.extend({
	//define the template
	template: _.template(LayersTemplate),
	events: {
	    'click button#add': 'addItem'
	},
	initialize:function() {
	    console.log(LayersTemplate);
	    console.log(LayerItem);
	    console.log(LayerItemView);

	    this.collection = new LayerList();
	    this.collection.bind('add', this.appendItem); // collection event binder

	    //bootstrapListHtml = '<ul class="list-group" id="layerList"></ul>';
	    //$('.panel-footer', this.el).append(bootstrapListHtml);

	    this.counter = 0; // total number of items added thus far
	    this.render();
	    
	},
	render:function() {
	    //write the template into the website
	    this.$el.html(this.template);
	},
	addItem: function(){
	    this.counter++;
	    var item = new LayerItem();
	    item.set({
		title: item.get('title') + this.counter // modify item defaults
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

    
    return LayersView;
    
});
