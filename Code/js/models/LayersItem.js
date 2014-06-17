//do I need require/define here?
define(function() {

    var LayersItem = Backbone.Model.extend({
	defaults: {
	    currentLayer: 0,
	    currentItem: false,
	    bufferLayerA: 0,
	    bufferLayerB: 0,
	    bufferItemA: 0,
	    bufferItemB: 0,
	    currentBuffer: 0,
	},
	toggleBuffer:function(index){
	    //function to swap buffers
	    //console.log('LayersItem.toggleBuffer(' + index + ')');
	    
	    if(index != this.get('currentBuffer')){
		//console.log('TOGGLING');
		if(index == 0){
		    this.set({bufferItemB: this.get('currentItem')});
		    this.set({bufferLayerB: this.get('currentLayer')});
		    this.set({currentItem: this.get('bufferItemA')})
		    this.set({currentLayer: this.get('bufferLayerA')});
		}
		else{
		    this.set({bufferItemA: this.get('currentItem')});
		    this.set({bufferLayerA: this.get('currentLayer')});
		    this.set({currentItem: this.get('bufferItemB')})
		    this.set({currentLayer: this.get('bufferLayerB')});
		}
		this.set({currentBuffer: index});
		return true;
	    }
	    else{
		//console.log('NOT TOGGLING');
		return false;
	    }
	},
    });
    
    return LayersItem;
});

