define(["text!templates/Levels.html"], function(LevelsTemplate) {
    
    var LevelsView = Backbone.View.extend({
	//define the template
	template: _.template(LevelsTemplate),
	events: {
	    'change select': "setLookup"
	},
	initialize:function() {
	    this.render();
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
