define(["models/LayerItem",
	"collections/LayerList",
	"views/XtkView",
	"views/LayerItemView",
	"text!templates/Layers.html"
       ],
       function(LayerItem,
		LayerList,
		XtkView,
		LayerItemView,
		LayersTemplate) {
    
    var LayersView = Backbone.View.extend({
	//define the template
	template: _.template(LayersTemplate),
	events: {
	    'click button#add': 'addItem',
	    'click button#bufferA':'handleClick',
	    'click button#bufferB':'handleClick',
	},
	initialize:function(options) {
	    console.log('LayersView.init()');
	    
	    _.bindAll(this, 'appendItem');
	    
	    this.layersModel = options.layersModel;
	    this.layersModel.on("change", this.setCurrentLayer, this);

	    Backbone.on('layerRemoved', this.removeItem, this);
	    Backbone.on('thresholdChange', this.thresholdChange, this);
	    Backbone.on('levelsChange', this.levelsChange, this);
	    Backbone.on('opacityChange', this.opacityChange, this);
	    Backbone.on('initValuesStored', this.resetSliders, this);
	    Backbone.on('lookupChange', this.setLookup, this);
	    //Backbone.on('xtkInitialised', this.updateCurrentIndex, this);

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
	    console.log('LayersView.addItem()');
	    console.log(this.layersModel);
	    
	    //create new item in collection
	    var item = new LayerItem();
	    item.set({
		// modify item defaults
		title: item.get('title') + this.counter,
		index: this.counter,
	    });

	    //adding new set of XTK viewers
	    var xtkViewer = new XtkView({
		layerIndex: this.counter,
		model: item,
	    });

	    this.layersModel.setCurrentItem(item);
	    console.log('AFTER SETTING ITEM');
	    console.log(this.layersModel);

	    this.collection.add(item);
	    this.counter++;
	},
	appendItem: function(item){
	    console.log('LayersView.appendItem()');
	    
	    var itemView = new LayerItemView({
		model: item,
		layersModel: this.layersModel,
	    });
	    $('#layerList', this.el).append(itemView.render().el);
	    itemView.setSelected(); //select the newly created item!
	    this.setCurrentLayer();
	},
	removeItem: function(layer){

	    //use index as an id for get layers!
	    
	    console.log(this.collection);
	},
	setCurrentLayer: function(){
	    //change the current model to reflect this!
	    console.log('LayersView.setCurrentLayer()');
	    console.log(this.layersModel);

	    //loop through all remaining and set to unselected
	    for(var index in this.collection.models){

		var item = this.collection.models[index];
		
		//set selected

		//console.log(item);
		//console.log(this.layersModel.getCurrentItem());
		
		if (item == this.layersModel.getCurrentItem()){
		    console.log('MATCH');
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
	    /////////////////////////////////////////////////////

	    this.resetSliders();
	    this.setLevelValues();
	    
	},
	setLevelValues: function(){
	    var currentItem = this.layersModel.getCurrentItem();
	    
	    //set text value
	    var wL = currentItem.get("windowLow");
	    var wH = currentItem.get("windowHigh");
	    var tL = currentItem.get("thresholdLow");
	    var tH = currentItem.get("thresholdHigh");
	    var o = currentItem.get("opacity");

	    $( "#levelLow" ).val(wL);
	    $( "#levelHigh" ).val(wH);
	    $( "#thresholdLow" ).val(tL);
	    $( "#thresholdHigh" ).val(tH);
	    $( "#opacityInput" ).val(o);

    	    //set slider value
	    $("#rangeSlider1").slider('values',0,wL); 
	    $("#rangeSlider1").slider('values',1,wH);
	    $("#rangeSlider2").slider('values',0,tL); 
	    $("#rangeSlider2").slider('values',1,tH);
	    $("#opacitySlider").slider('value',o);

	    //console.log(currentItem);
	},
	thresholdChange: function(args){
	    console.log('triggering layerThresholdChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({thresholdLow: args[0],thresholdHigh: args[1]});
	},
	levelsChange: function(args){
	    console.log('triggering layerLevelsChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({windowLow: args[0],windowHigh: args[1]});
	},
	opacityChange: function(arg){
	    console.log('triggering layerOpacityChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({opacity: arg});
	},
	resetSliders:function(){
	    console.log('LayersView.resetSliders()');

	    var currentItem = this.layersModel.getCurrentItem();
	    //console.log(currentItem);

	    //set original values
	    var wLO = currentItem.get("windowLowOrig");
	    var wHO = currentItem.get("windowHighOrig");
	    var tLO = currentItem.get("thresholdLowOrig");
	    var tHO = currentItem.get("thresholdHighOrig");

	    $("#rangeSlider1").slider('option',{min: wLO, max: wHO});
	    $("#rangeSlider2").slider('option',{min: tLO, max: tHO}); 

	    this.setLevelValues();
	},
	handleClick:function(value){
	    if (value.currentTarget.id == 'bufferA')
		this.setBuffer(0);
	    else 
		this.setBuffer(1);
	},
	setBuffer:function(value){
	    if(this.layersModel.toggleBuffer(value)){
		if (value == 0){
		    $('#bufferB', this.el).removeClass('layer-selected');
		    $('#bufferB', this.el).addClass('layer-unselected');
		    $('#bufferA', this.el).removeClass('layer-unselected');
		    $('#bufferA', this.el).addClass('layer-selected');
		}
		else{
		    $('#bufferA', this.el).removeClass('layer-selected');
		    $('#bufferA', this.el).addClass('layer-unselected');
		    $('#bufferB', this.el).removeClass('layer-unselected');
		    $('#bufferB', this.el).addClass('layer-selected');
		}
	    }
	},
	setLookup:function(value){
	    console.log('LayersView.setLookup()');
	    console.log(value);

	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({colortable: value});

	},
    });

    
    return LayersView;
    
});
