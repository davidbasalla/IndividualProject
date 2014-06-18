//do I need require/define here?
define(function() {

    var LayersItem = Backbone.Model.extend({
	defaults: {
	    bufferALayerItem: null,
	    bufferBLayerItem: null,
	    currentBufferIndex: 0,
	},
	getCurrentItem:function(){
	    //console.log('LayersItem.getCurrentItem()');
	    
	    /* returns current item based on bufferIndex */
	    if(this.get('currentBufferIndex') == 0)
		return this.get('bufferALayerItem');
	    else
		return this.get('bufferBLayerItem');
	},
	getOtherItem:function(){
	    //console.log('LayersItem.getCurrentItem()');
	    
	    /* returns NON-current item based on bufferIndex */
	    if(this.get('currentBufferIndex') != 0)
		return this.get('bufferALayerItem');
	    else
		return this.get('bufferBLayerItem');
	},
	setCurrentItem:function(item){
	    /* set the current layerItem, based on bufferIndex */
	    //console.log('LayersItem.setCurrentItem()');
	    //console.log(item);
	    
	    if(this.get('currentBufferIndex') == 0)
		this.set({bufferALayerItem: item});
	    else
		this.set({bufferBLayerItem: item});

	    //if initially at NULL, set these
	    if(!this.get('bufferALayerItem'))
		this.set({bufferALayerItem: item});
	    if(!this.get('bufferBLayerItem'))
	    	this.set({bufferBLayerItem: item});
	    
	},
	toggleBuffer:function(index){
	    //function to swap buffers
	    //console.log('LayersItem.toggleBuffer(' + index + ')');
	    
	    if(index != this.get('currentBufferIndex')){
		this.set({currentBufferIndex: index});
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

