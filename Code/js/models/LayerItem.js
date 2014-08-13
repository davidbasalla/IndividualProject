//do I need require/define here?
define(function() {

    var LayerItem = Backbone.Model.extend({
	defaults: {
	    title: 'Layer',
	    visible: true,
	    file: null,
	    fileName: 'dummyFileName',
	    annoFile: null,
	    annoFileName: 'dummyFileName2',
	    type: 'scan',
	    index: 0,
	    windowLow: 0,
	    windowHigh: 100,
	    thresholdLow: 0,
	    thresholdHigh: 100,
	    windowLowOrig: 0,
	    windowHighOrig: 100,
	    thresholdLowOrig: 0,
	    thresholdHighOrig: 100,
	    indexX: 0,
	    indexY: 0,
	    indexZ: 0,
	    loaded: false,
	    opacity: 100,
	    colortable: null,
	    annotations: [],
	},
	setAnnos:function(annoArray){
	    console.log('LayersItem.setAnnos()');
	    
	    this.set({
		annotations: annoArray
	    });
	    //this.trigger("change:annotations");
	},	
	setAndTriggerAnnos:function(annoArray){
	    console.log('LayersItem.setAndTriggerAnnos()');
	    
	    this.set({
		annotations: annoArray
	    });

	    console.log(annoArray);
	    this.trigger("change:annotations");
	},
	addAnnos:function(newArray){
	    console.log('LayersItem.addAnnos()');
	    //clone it to trigger the change
	    var oldArray = _.clone(this.get('annotations'));

	    //add new array
	    for(var i = 0; i < newArray.length; i++){
		oldArray.push(newArray[i])
	    };
	    
	    this.set({annotations: oldArray});
	},
	removeAnno:function(annoObject){
	    console.log('LayersItem.removeAnno()');

	    var oldArray = _.clone(this.get('annotations'));
	    oldArray = _.without(oldArray, annoObject);
	    this.set({annotations: oldArray});
	},
    });
    return LayerItem;
});
