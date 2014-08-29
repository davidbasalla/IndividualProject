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
	    labelmapFile: null,
	    labelmapVisible: true,
	    labelmapOpacity: 100,
	    labelmapColortable: 1,
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
	setToMaxIndex:function(orientation){
	
	    var max = this.attributes.range[orientation] - 1;

	    if(orientation == 0)
		this.set({indexX: max});
	    else if(orientation == 1)
		this.set({indexY: max});
	    else if(orientation == 2)
		this.set({indexZ: max});
	},
	setToMinIndex:function(orientation){

	    console.log('setToMaxIndex');

	    if(orientation == 0)
		this.set({indexX: 0});	    
	    else if(orientation == 1)
		this.set({indexY: 0});
	    else if(orientation == 2)
		this.set({indexZ: 0});

	},



    });
    return LayerItem;
});
