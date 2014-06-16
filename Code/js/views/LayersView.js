define(["models/LayerItem",
	"models/LayersItem",
	"collections/LayerList",
	"views/XtkView",
	"views/LayerItemView",
	"text!templates/Layers.html"
       ],
       function(LayerItem,
		LayersItem,
		LayerList,
		XtkView,
		LayerItemView,
		LayersTemplate) {
    
    var LayersView = Backbone.View.extend({
	//define the template
	template: _.template(LayersTemplate),
	events: {
	    'click button#add': 'addItem'
	},
	initialize:function(options) {
	    console.log('LayersView.init()');
	    
	    this.layersModel = new LayersItem();
	    
	    Backbone.on('layerRemoved', this.removeItem, this);
	    Backbone.on('thresholdChange', this.thresholdChange, this);
	    Backbone.on('levelsChange', this.levelsChange, this);
	    Backbone.on('xtkInitialised', this.updateCurrentIndex, this);

	    Backbone.on('setSelected', this.setCurrentLayer, this);
	    

	    this.currentLayerIndex = 0;
	    
	    this.collection = new LayerList();
	    this.collection.bind('add', this.appendItem); // collection event binder

	    this.counter = 0; // total number of items added thus far


	    this.render();
	},
	render:function() {
	    //write the template into the website
	    this.$el.html(this.template);
	},
	addItem: function(){

	    //create new item in collection
	    var item = new LayerItem();
	    item.set({
		// modify item defaults
		title: item.get('title') + this.counter,
		index: this.counter,
	    });
	    this.collection.add(item);


	    //adding new set of XTK viewers
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
	setCurrentLayer: function(args){
	    //change the current model to reflect this!
	    
	    //console.log('LayersView.setCurrentLayer()');

	    this.layersModel.set({
		currentLayer: args[0],
		currentItem: args[1]
	    });

	    console.log('Looping through the collection:');
	    
	    //loop through all remaining and set to unselected
	    for(var index in this.collection.models){

		var item = this.collection.models[index];
		
		//set unselected
		if (item.get('index') == args[0]){
		    item.set({
			selected: true
		    });
		}
		else{
		    item.set({
			selected: false
		    });
		};
	    };
	
	    /*
	    //set levels back to what they should be
	    var items = this.collection.where({ index : this.currentLayerIndex })


	    /////////////////////////////////////////////////////
	    
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
	    */
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
