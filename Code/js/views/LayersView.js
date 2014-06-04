define(["text!templates/Layers.html", "views/LayerItemView","models/LayerItem", "collections/LayerList"], function(LayersTemplate, LayerItemView,  LayerItem, LayerList) {
    
    var LayersView = Backbone.View.extend({
	//define the template
	template: _.template(LayersTemplate),
	events: {
	    'click button#add': 'addItem'
	},
	initialize:function() {
	    //console.log(LayersTemplate);
	    //console.log(LayerItem);
	    //console.log(LayerItemView);

	    Backbone.on('layerRemoved', this.removeItem, this);
	    Backbone.on('setSelected', this.setCurrentLayer, this);
	    Backbone.on('thresholdChange', this.thresholdChange, this);
	    

	    this.currentLayer = 0;
	    
	    this.collection = new LayerList();
	    this.collection.bind('add', this.appendItem); // collection event binder

	    this.counter = 0; // total number of items added thus far
	    
	},
	render:function() {
	    //write the template into the website
	    this.$el.html(this.template);
	},
	addItem: function(){
	    this.counter++;
	    var item = new LayerItem();
	    item.set({
		// modify item defaults
		title: item.get('title') + this.counter,
		index: this.counter,
	    });
	    this.collection.add(item);
	},
	appendItem: function(item){
	    var itemView = new LayerItemView({
		model: item
	    });
	    $('#layerList', this.el).append(itemView.render().el);
	    itemView.setSelected();
	},
	removeItem: function(layer){

	    //use index as an id for get layers!
	    
	    console.log(this.collection);
	},
	setCurrentLayer: function(layerIndex){
	    this.currentLayer = layerIndex;
	    console.log(this.currentLayer);
	},
	thresholdChange: function(args){
	    Backbone.trigger('layerThresholdChange', [this.currentLayer, args[0], args[1]]);
	},
    });

    
    return LayersView;
    
});
