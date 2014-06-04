define(["text!templates/Layers.html", "views/LayerItemView","models/LayerItem", "collections/LayerList","views/ViewerWindowView"], function(LayersTemplate, LayerItemView,  LayerItem, LayerList, ViewerWindowView) {
    
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
	    Backbone.on('levelsChange', this.levelsChange, this);
	    

	    this.currentLayerIndex = 0;
	    
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


	    var viewerWindow = new ViewerWindowView({
		el: $('#viewerWindow')
	    });
	    viewerWindow.layerIndex = this.counter;
	    viewerWindow.render();
	    
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
	    this.currentLayerIndex = layerIndex;
	    console.log(this.currentLayerIndex);
	},
	thresholdChange: function(args){
	    //console.log('triggering layerThresholdChange');
	    Backbone.trigger('layerThresholdChange', [this.currentLayerIndex, args[0], args[1]]);
	},
	levelsChange: function(args){
	    //console.log('triggering layerThresholdChange');
	    Backbone.trigger('layerLevelsChange', [this.currentLayerIndex, args[0], args[1]]);
	},
    });

    
    return LayersView;
    
});
