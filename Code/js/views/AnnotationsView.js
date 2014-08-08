define(["text!templates/Annotation.html", "views/AnnotationItemView"], function(AnnotationTemplate, AnnoItemView) {
    
    var AnnotationView = Backbone.View.extend({
	//define the template
	template: _.template(AnnotationTemplate),
	initialize:function(options) {
	    this.currentItem = null;//item for detecting changes
	    this.layersModel = options.layersModel;

	    //array for keeping track of annoLayerItemViews
	    this.annoLayerViews = [];

	    this.render();
	},	
	events: {	    
	    'change input#xmlInput': 'fileSelected',	    
	    'click button#loadAnnoFile': 'loadXmlFile',
	},
	render:function() {

	    this.$el.html(this.template);
	    $('#xmlInput', this.el).hide();
	},	
	loadXmlFile: function(event){
	    //trigger the hidden fileLoader
	    $('#xmlInput',this.el).trigger('click');
	    event.stopPropagation(); 
	},
	fileSelected:function(e){
	    console.log('AnnotationView.xmlFileSelected()');

	    console.log(e);

	    var file = e.currentTarget.files[0];

	    
	    // FILE READING
	    var reader = new FileReader();

	    var _this = this;
	    reader.onload = function(e){
		(_this.parseJSON(reader.result)); // bind the current type
	    }

	    reader.readAsText(file);

	},
	parseJSON:function(inputString){
	    console.log('AnnotationView.parseJSON()');

	    var annos = JSON.parse(inputString);
	    annos = annos.annotations;
	    console.log(annos);
	    
	    var annoArray = _.clone(this.currentItem.get('annotations'));
	    
	    //loop through, add to new array and create a display layer
	    for(var i = 0; i < annos.length; i++){
		console.log('ADDING ANNOTATION');
		annoArray.push(annos[i]);
		this.createLayer(annos[i]);
	    }
	    
	    //update current item with loaded objects
	    this.currentItem.set({
		annotations: annoArray,
	    }); 

	},
	createLayer:function(annoObject){

	    var annoLayerItem = new AnnoItemView({
		index: this.annoLayerViews.length,
		layersModel: this.layersModel, //NEED TO PASS THIS
		annoObject: annoObject
	    });
	    $('#annolayerList', this.el).append(annoLayerItem.render().el);

	    this.annoLayerViews.push(annoLayerItem);

	},
	updateLayers:function(){
	    /* FUNCTION FOR MANAGING ARRAY AND INDECES IN CASE OF
	       OUT OF ORDER DELETION */


	},
	setCurrentItem:function(currentItem){
	    console.log('AnnotationView.setCurrentItem()');

	    if(this.currentItem){
		this.currentItem.off("change:indexX", this.setIndexX, this);
		this.currentItem.off("change:indexY", this.setIndexY, this);
		this.currentItem.off("change:indexZ", this.setIndexZ, this);
	    }
	    
	    //get new object
	    this.currentItem = currentItem;
	    
	    //turn ON triggers for current object
	    if(this.currentItem){
		//console.log('LISTENING TO MODEL:');
		//console.log(this.currentItem);

		this.currentItem.on("change:indexX", this.setIndexX, this);
		this.currentItem.on("change:indexY", this.setIndexY, this);
		this.currentItem.on("change:indexZ", this.setIndexZ, this);
	    }
	    //make it listen to changes in the currentitem model

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
    });
    return AnnotationView;
    
});
