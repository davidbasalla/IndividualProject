/* some nastiness going on with models and itemViews, it's like
   a doubling up and requires extra handling which is annoying and 
   may cause trouble in the future!!*/

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
	    this.levelsView = options.levelsView;
	    this.annotationView = options.annotationView;
	    this.labelmapView = options.labelmapView;

	    //set viewerWindowView, required for managing XTKViews
	    this.viewerWindowView = options.viewerWindowView;

	    this.layerItemViewArray = [];

	    Backbone.on('thresholdChange', this.thresholdChange, this);
	    Backbone.on('levelsChange', this.levelsChange, this);
	    Backbone.on('opacityChange', this.opacityChange, this);
	    Backbone.on('initValuesStored', this.setLevelsSettings, this);
	    Backbone.on('lookupChange', this.setLookup, this);
	    Backbone.on('labelmapChange', this.setLabelmap, this);
	    Backbone.on('labelmapOpacityChange', this.labelmapOpacityChange, this);

	    //Backbone.on('xtkInitialised', this.updateCurrentIndex, this);

	    this.collection = new LayerList();
	    //this.collection.bind('add', this.appendItem); // collection event binder

	    this.counter = 0; // total number of items added thus far

	    this.render();
	},
	render:function() {
	    //write the template into the website
	    this.$el.html(this.template);

	    //$( document ).tooltip();

	    $("#add").tooltip({delay: { show: 500, hide: 100 }});
	    $("#bufferToggle").tooltip({delay: { show: 500, hide: 100 }});


	    //$("#bufferB").tooltip({delay: { show: 500, hide: 100 }});

	    //$( "#bufferA" ).tooltip({ hide: { effect: "explode", duration: 1000 } });
	    //$( "#bufferA" ).tooltip( "option", "tooltipClass", "custom-tooltip-styling" )

	},
	addItem: function(){

	    console.log('LayersView.addItem()');
	    
	    //create new item in collection
	    var item = new LayerItem();
	    item.set({
		// modify item defaults
		title: item.get('title') + this.counter,
		index: this.counter,
	    });

	    //adding as layerIndex and as model
	    this.viewerWindowView.addXtkView(this.counter, item);
	    
	    this.collection.add(item);
	    this.appendItem(item);
	    this.counter++;
	},
	appendItem: function(item){
	    console.log('LayersView.appendItem()');
	    
	    var itemView = new LayerItemView({
		model: item,
		layersModel: this.layersModel,
		layersView: this,
	    });
	    $('#layerList', this.el).append(itemView.render().el);

	    //update the array
	    this.layerItemViewArray[this.layerItemViewArray.length] = itemView;

	    this.setSelected(item, itemView);
	},
	setSelected: function(layerItem, layerItemView){
	    /* requires the coupling of item and itemView, kinda dumb */
	    console.log('LayersView.setSelected()');

	    //set layerItem to be current
	    if(layerItem){
		this.layersModel.setCurrentItem(layerItem);

		this.setLevelsSettings(layerItem);
	    }
	    else{

		this.setLevelsSettings(null);
		this.layersModel.set({
		    bufferALayerItem:null,
		    bufferBLayerItem:null
		});
	    }
	    if(layerItemView)
		this.setSelectedLayerItemView(layerItemView);
	},
	setSelectedLayerItemView: function(layerItemView){
	    console.log('LayersView.setSelectedLayerItem()');

	    //remove selected class from all layerItemViews
	    for(index in this.layerItemViewArray){
		this.layerItemViewArray[index].setUnselected();
	    }
	
	    //add selected class to current item
	    layerItemView.setSelected();
	},
	removeItem: function(layerItem, layerItemView){
	    console.log('LayersView.removeItem()');

	    //remove associated layerItem from collection
	    this.collection.remove(layerItem);

	    //remove associated layerItemView from array
	    for(var i = 0; i < this.layerItemViewArray.length; i++){
		if (this.layerItemViewArray[i] == layerItemView)
		    this.layerItemViewArray.splice(i,1);
	    }

	    //remove associated xtkView
	    this.viewerWindowView.removeXtkView(layerItem.get('index'));

	    //set to previous item OR black
	    if(this.layersModel.getCurrentItem() == layerItem){
		if(this.collection.length > 0){
		    this.setSelected(this.collection.models[this.collection.length - 1],
				     this.layerItemViewArray[this.layerItemViewArray.length - 1]);

		    //if removed item was in buffer B
		    if(layerItem == this.layersModel.getOtherItem()){
			//if other items present
			if(this.collection.length > 0)
			    this.layersModel.setOtherItem(this.collection.models[this.collection.length - 1]);
			else
			    this.layersModel.setOtherItem(null);
		    }
	    
		}
		else{
		    //when nothing left to display
		    console.log('NOTHING LEFT TO DISPLAY');

		    this.viewerWindowView.stopAnimation();
		    this.setSelected(null, null);
		}
	    }
	},
	setLevelsSettings:function(currentItem){
	    /* gets called when layer is switched OR layerItem is updated
	       once a file has loaded */
	    console.log('LayersView.setLevelsSettings()');

	    //should sideBar handle this?
	    this.levelsView.setCurrentItem(currentItem);
	    this.annotationView.setCurrentItem(currentItem);
	    this.labelmapView.setCurrentItem(currentItem);
	},
	thresholdChange: function(args){
	    ////console.log('triggering layerThresholdChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({thresholdLow: args[0],thresholdHigh: args[1]});
	},
	levelsChange: function(args){
	    ////console.log('triggering layerLevelsChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({windowLow: args[0],windowHigh: args[1]});
	},
	opacityChange: function(arg){
	    ////console.log('triggering layerOpacityChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({opacity: arg});
	},	
	labelmapOpacityChange: function(arg){
	    ////console.log('triggering layerOpacityChange');

	    //update the model
	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({labelmapOpacity: arg});
	},
	handleClick:function(value){
	    if (value.currentTarget.id == 'bufferA')
		this.setBuffer(0);
	    else 
		this.setBuffer(1);
	},
	setBuffer:function(value){
	    console.log('SET BUFFER ' + value);

	    if(this.layersModel.toggleBuffer(value)){

		//FIGURE OUT WHICH layerItemView to activate - NASTY
		var layerItemView = null;
		var currentItem = this.layersModel.getCurrentItem();
		
		for(index in this.layerItemViewArray){
		    if(this.layerItemViewArray[index].model == currentItem)
			layerItemView = this.layerItemViewArray[index];
		}

		this.setSelectedLayerItemView(layerItemView);

		
		//SET THE CSS FOR BUFFER BUTTON
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
	    ////console.log('LayersView.setLookup()');
	    ////console.log(value);

	    var currentItem = this.layersModel.getCurrentItem();
	    currentItem.set({colortable: value});

	    console.log(currentItem);
	},	
    });

    
    return LayersView;
    
});
