define(["text!templates/Annotation.html", "views/AnnotationItemView"], function(AnnotationTemplate, AnnoItemView) {
    
    var AnnotationView = Backbone.View.extend({
	//define the template
	template: _.template(AnnotationTemplate),
	initialize:function(options) {
	    this.currentItem = null;//item for detecting changes
	    this.layersModel = options.layersModel;

	    //current annotation array
	    this.annotations = [];


	    _.bindAll(this, 'fileSelected');


	    //array for keeping track of annoLayerItemViews
	    this.annoLayerViews = [];

	    this.render();
	},	
	events: {	    
	    'change input#xmlInput': 'fileSelected',	    
	    'click button#loadAnnoFile': 'loadXmlFile',	    
	    'click button#saveAnnoFile': 'saveXmlFile',
	    'click button#newAnnotation': 'newAnnotation',
	},
	render:function() {

	    this.$el.html(this.template);
	    $('#xmlInput', this.el).hide();

	    var input = document.getElementById('xmlInput');
	    
	    //clear filepicker for same input again
	    input.onclick = function () {
		this.value = null;
	    };
	},
	newAnnotation:function(){
	    /* when creating a new annotation, place it in the
	       center of the current indeces, with a given size as
	       offset. Make sure to take bad verts into account */


	    console.log('AnnotationView.newAnnotation()');
	    
	    
	    //create a new annotation object

	    var curX = this.currentItem.get('indexX');
	    var curY = this.currentItem.get('indexY');
	    var curZ = this.currentItem.get('indexZ');
	    var offset = 5;

	    var annoObject = {
		"shape":"cube",
		"label":"annotation_" + this.currentItem.get('annotations').length,
		"color":"#888888",
		"points3D":[
		    [curX - offset, curY - offset, curZ + offset],
		    [curX - offset, curY + offset, curZ + offset],
		    [curX - offset, curY + offset, curZ - offset],
		    [curX - offset, curY - offset, curZ - offset],  
		    [curX + offset, curY - offset, curZ + offset],
		    [curX + offset, curY + offset, curZ + offset],
		    [curX + offset, curY + offset, curZ - offset],
		    [curX + offset, curY - offset, curZ - offset]
		] 
	    };
	    
	    this.currentItem.addAnnos([annoObject]);	    
	    this.createLayerView(annoObject);

	},
	saveXmlFile:function(event){
	    console.log('AnnotationView.saveXmlFile()');
	    
	    console.log( this.currentItem.get('annotations'));
	    
	    //remove redundancies...
	    var annosArray = this.currentItem.get('annotations');
	    for(var i = 0; i < annosArray.length; i++){
		if(annosArray[i].manipulators)
		    delete annosArray[i].manipulators;
	    }



	    var text = JSON.stringify(annosArray);
	    var data = new Blob([text], {type: 'text/plain'});
	    var textFile = null;

	    // If we are replacing a previously generated file we need to
	    // manually revoke the object URL to avoid memory leaks.
	    if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	    }

	    textFile = window.URL.createObjectURL(data);

	    //return textFile;


	    var link = document.getElementById('downloadlink');
	    link.href = textFile;
	    //link.style.display = 'block';	    

	    link.click();
	    

	    //event.stopPropagation(); 
	},
	loadXmlFile: function(event){
	    console.log('AnnotationView.loadXmlFile()');

	    //trigger the hidden fileLoader
	    $('#xmlInput', this.el).trigger('click');
	    event.stopPropagation(); 
	},
	fileSelected:function(e){
	    console.log('AnnotationView.xmlFileSelected()');

	    var file = e.currentTarget.files[0];

	    
	    // FILE READING
	    var reader = new FileReader();

	    var _this = this;
	    reader.onload = function(e){
		(_this.parseJSON(reader.result)); // bind the current type
	    }

	    reader.readAsText(file);

	    //reset value of fileLoader to null

	},
	parseJSON:function(inputString){
	    console.log('AnnotationView.parseJSON()');

	    var annos = JSON.parse(inputString);
	    this.currentItem.setAnnos(annos);

	    //loop through,create a display layer
	    for(var i = 0; i < annos.length; i++){
		this.createLayerView(annos[i]);
	    }
	},
	createLayerView:function(annoObject){

	    var annoLayerItem = new AnnoItemView({
		index: this.annoLayerViews.length,
		layersModel: this.layersModel, //NEED TO PASS THIS
		annoObject: annoObject,
		annosView: this
	    });
	    $('#annolayerList', this.el).append(annoLayerItem.render().el);

	    this.annoLayerViews.push(annoLayerItem);

	},
	deleteLayerView:function(annoItemView){
	    console.log('AnnotationsView.deleteLayer()');
	    
	    //remove object from currentItem.annotations
	    this.currentItem.removeAnno(annoItemView.index);

	    //remove the layerView
	    this.annoLayerViews.splice(annoItemView.index, 1);
	    $(annoItemView.el).remove();

	    this.updateLayers();
	},
	updateLayers:function(){
	    /* FUNCTION FOR MANAGING ARRAY AND INDECES IN CASE OF
	       OUT OF ORDER DELETION */

	    for(var i = 0; i < this.annoLayerViews.length; i++){
		this.annoLayerViews[i].index = i;
	    }
	},
	updateFromModel:function(model, value, options){
	    console.log('AnnotationsView.updateFromModel()');

	    //step through layerViews and update their objects!
	    //or just remove and redraw?

	    console.log(model);
	    console.log(value);


	    for(var i = 0; i < this.annoLayerViews.length; i++){
		this.annoLayerViews[i].annoObject = value[i];
	    }
	},
	updateModel:function(){
	    //update the model with current annotations
	    
	    //step through the layerViews
	    //copy the objects into array
	    //push array into current model

	    //var annoArray =  _.clone(this.currentItem.get('annotations'));
	    var annoArray = [];
	    for(var i = 0; i < this.annoLayerViews.length; i++){
		annoArray.push(this.annoLayerViews[i].annoObject);
	    }
	    
	    this.currentItem.setAnnos(annoArray);
	},
	setCurrentItem:function(currentItem){
	    console.log('AnnotationView.setCurrentItem()');

	    if(this.currentItem){
		this.currentItem.off("change:annotations", this.updateFromModel, this);
	    }
	    
	    //get new object
	    this.currentItem = currentItem;
	    
	    //turn ON triggers for current object
	    if(this.currentItem){
		this.currentItem.on("change:annotations", this.updateFromModel, this);
	    }

	    this.setSettings(currentItem);
	},
	setSettings:function(currentItem){
	    //would have to reset the annotations here!!


	    //set text value
	    /*
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
	    */
	},
    });
    return AnnotationView;
    
});
