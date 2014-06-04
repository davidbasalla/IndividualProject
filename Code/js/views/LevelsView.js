define(["text!templates/Levels.html"], function(LevelsTemplate) {
    
    var LevelsView = Backbone.View.extend({
	//define the template
	template: _.template(LevelsTemplate),
	events: {
	},
	initialize:function() {
	    //console.log(LevelsTemplate);
	    //console.log(LayerItem);
	    //console.log(LayerItemView);

	},
	render:function() {
	    //write the template into the website
	    this.$el.append(this.template);

	    $( "#rangeSlider1" ).slider({
		range: true,
		min: 0,
		max: 100,
		values: [ 0, 100 ],
		//onslide
		slide: function( event, ui ) {
		    $( "#levelLow" ).val(ui.values[0]);
		    $( "#levelHigh" ).val(ui.values[1]);
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
		}
	    });
	    

	    //console.log($("#slider-range", this.el));
	    //$("#slider-range", this.el).slider();

	    /*
	      $("#slider-range", this.el).slider({
	      range: true,
	      min: 0,
	      max: 500,
	      values: [ 75, 300 ],
	      slide: function( event, ui ) {
	      $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
	      }
	      });
	      $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
	      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	    */
	},
    });

    
    return LevelsView;
    
});
