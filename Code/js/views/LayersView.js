define(["text!templates/Layers.html", "views/LayerItemView","models/LayerItem", "collections/LayerList","views/XtkView"], function(LayersTemplate, LayerItemView,  LayerItem, LayerList, XtkView) {
    
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
   
	    var item = new LayerItem();
	    item.set({
		// modify item defaults
		title: item.get('title') + this.counter,
		index: this.counter,
	    });
	    this.collection.add(item);

	    console.log('counter = ' + this.counter);

	    var xtkViewer = new XtkView({
		layerIndex: this.counter,
		model: item,
	    });
	    
	    this.counter++;
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

	    //set levels back to what they should be
	    var items = this.collection.where({ index : this.currentLayerIndex })

	    //set text value
	    var wL = items[0].get("windowLow");
	    var wH = items[0].get("windowHigh");
	    var tL = items[0].get("thresholdLow");
	    var tH = items[0].get("thresholdHigh");

	    $( "#levelLow" ).val(wL);
	    $( "#levelHigh" ).val(wH);
	    $( "#thresholdLow" ).val(tL);
	    $( "#thresholdHigh" ).val(tH);

    	    //set slider value
	    $("#rangeSlider1").slider('values',0,wL); 
	    $("#rangeSlider1").slider('values',1,wH);
	    $("#rangeSlider2").slider('values',0,tL); 
	    $("#rangeSlider2").slider('values',1,tH); 
	},
	thresholdChange: function(args){
	    //console.log('triggering layerThresholdChange');
	    Backbone.trigger('layerThresholdChange', [this.currentLayerIndex, args[0], args[1]]);

	    //update the model
	    var items = this.collection.where({ index : this.currentLayerIndex })
	    items[0].set({thresholdLow: args[0],thresholdHigh: args[1]});
	},
	levelsChange: function(args){
	    //console.log('triggering layerThresholdChange');
	    Backbone.trigger('layerLevelsChange', [this.currentLayerIndex, args[0], args[1]]);

	    //update the model
	    var items = this.collection.where({index : this.currentLayerIndex })
	    items[0].set({windowLow: args[0],windowHigh: args[1]});
	    
	},
    });

    
    return LayersView;
    
});
