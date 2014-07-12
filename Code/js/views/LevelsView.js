define(["text!templates/Levels.html"], function(LevelsTemplate) {
    
    var LevelsView = Backbone.View.extend({
	//define the template
	template: _.template(LevelsTemplate),
	events: {
	    'change select': "setLookup"
	},
	initialize:function() {
	    this.currentItem = null;//item for detecting changes

	    this.render();
	},	
	events: {
	    'change input#indexX': 'setIndexInputHandler',
	    'change input#indexY': 'setIndexInputHandler',
	    'change input#indexZ': 'setIndexInputHandler',
	},
	render:function() {
	    //write the template into the website
	    this.$el.html(this.template);

	    $( "#rangeSlider1" ).slider({
		range: true,
		min: 0,
		max: 100,
		values: [ 0, 100 ],
		//onslide
		slide: function( event, ui ) {
		    $( "#levelLow" ).val(ui.values[0]);
		    $( "#levelHigh" ).val(ui.values[1]);
		    Backbone.trigger('levelsChange', [ui.values[0],ui.values[1]]);
		}
	    });

	    $( "#rangeSlider2" ).slider({
		range: true,
		min: 0,
		max: 100,
		values: [ 0, 100 ],
		//onslide
		slide: function( event, ui ) {
		    $( "#thresholdLow" ).val(ui.values[0]);
		    $( "#thresholdHigh" ).val(ui.values[1]);
		    Backbone.trigger('thresholdChange', [ui.values[0],ui.values[1]]);
		}
	    });

	    $( "#opacitySlider" ).slider({
		min: 0,
		max: 100,
		value: 100,
		slide: function( event, ui ) {
		    $( "#opacityInput" ).val(ui.value);
		    Backbone.trigger('opacityChange', ui.value);
		}
	    });
	},
	setCurrentItem:function(currentItem){
	    console.log('LevelsView.setCurrentItem()');

	    if(this.currentItem){
		this.currentItem.off("change:indexX", this.setIndexX, this);
		this.currentItem.off("change:indexY", this.setIndexY, this);
		this.currentItem.off("change:indexZ", this.setIndexZ, this);
	    }
	    
	    //get new object
	    this.currentItem = currentItem;
	    
	    //turn ON triggers for current object
	    if(this.currentItem){
		console.log('LISTENING TO MODEL:');
		console.log(this.currentItem);

		this.currentItem.on("change:indexX", this.setIndexX, this);
		this.currentItem.on("change:indexY", this.setIndexY, this);
		this.currentItem.on("change:indexZ", this.setIndexZ, this);
	    }
	    //make it listen to changes in the currentitem model

	    this.setSliders(currentItem);
	    this.setSettings(currentItem);
	},
	setSettings:function(currentItem){
	    //set text value
	    var wL = currentItem.get("windowLow");
	    var wH = currentItem.get("windowHigh");
	    var tL = currentItem.get("thresholdLow");
	    var tH = currentItem.get("thresholdHigh");
	    var o = currentItem.get("opacity");
	    var indexX = currentItem.get("indexX");
	    var indexY = currentItem.get("indexY");
	    var indexZ = currentItem.get("indexZ");

	    $( "#levelLow" ).val(wL);
	    $( "#levelHigh" ).val(wH);
	    $( "#thresholdLow" ).val(tL);
	    $( "#thresholdHigh" ).val(tH);
	    $( "#opacityInput" ).val(o);
	    $( "#indexX" ).val(indexX);
	    $( "#indexY" ).val(indexY);
	    $( "#indexZ" ).val(indexZ);

    	    //set slider value
	    $("#rangeSlider1").slider('values',0,wL); 
	    $("#rangeSlider1").slider('values',1,wH);
	    $("#rangeSlider2").slider('values',0,tL); 
	    $("#rangeSlider2").slider('values',1,tH);
	    $("#opacitySlider").slider('value',o);
	},
	setIndexX:function(model, indexX, options){
	    $( "#indexX" ).val(indexX);
	},
	setIndexY:function(model, indexY, options){
	    $( "#indexY" ).val(indexY);
	},
	setIndexZ:function(model, indexZ, options){
	    $( "#indexZ" ).val(indexZ);
	},
	setIndexInputHandler:function(e){
	    console.log('LevelsView.setIndexInputHandler()');

	    var val = Number(e.target.value);

	    if(this.currentItem){
		if(e.target.id == 'indexX'){
		    this.currentItem.set({indexX: val});
		}
		else if(e.target.id == 'indexY'){
		    this.currentItem.set({indexY: val});
		}
		else if(e.target.id == 'indexZ'){
		    this.currentItem.set({indexZ: val});
		}
	    }
	},
	setSliders:function(currentItem){
	    //console.log('LayersView.resetSliders()');

	    //set original values
	    var wLO = currentItem.get("windowLowOrig");
	    var wHO = currentItem.get("windowHighOrig");
	    var tLO = currentItem.get("thresholdLowOrig");
	    var tHO = currentItem.get("thresholdHighOrig");

	    $("#rangeSlider1").slider('option',{min: wLO, max: wHO});
	    $("#rangeSlider2").slider('option',{min: tLO, max: tHO}); 
	},

	setWindowOrigValues:function(value){
	    console.log('setWindowLowOrig');

	    console.log($( "#rangeSlider1" ));
	    //set slider range values correctly
	    //set the number correctly
	    
	},
	setLookup:function(value){
	    console.log('LevelsView.setLookup()');
	    console.log(value.currentTarget.value);
	    Backbone.trigger('lookupChange', value.currentTarget.value);

	},

    });
    return LevelsView;
    
});
