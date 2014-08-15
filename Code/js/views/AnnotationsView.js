define(["text!templates/Annotation.html", 
	"classes/Annotation",
	"views/AnnotationItemView"], 
       function(AnnotationTemplate, 
		Annotation,
		AnnoItemView) {
    
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
	    'click button#importAnnoFile': 'importXmlFile',	 
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

	    var annoObject = new Annotation();
	    annoObject.label = "annotation_" + this.currentItem.get('annotations').length;
	    annoObject.points3D = [[curX - offset, curY - offset, curZ + offset],
				   [curX - offset, curY + offset, curZ + offset],
				   [curX - offset, curY + offset, curZ - offset],
				   [curX - offset, curY - offset, curZ - offset],  
				   [curX + offset, curY - offset, curZ + offset],
				   [curX + offset, curY + offset, curZ + offset],
				   [curX + offset, curY + offset, curZ - offset],
				   [curX + offset, curY - offset, curZ - offset]
				  ];
	    annoObject.print();
	    
	    this.currentItem.addAnnos([annoObject]);	    
	    this.createLayerView(annoObject);
	},
	saveXmlFile:function(event){
	    console.log('AnnotationView.saveXmlFile()');
	    
	    console.log( this.currentItem.get('annotations'));
	    
	    //remove redundancies...
	    var annosArray = this.currentItem.get('annotations');
	    for(var i = 0; i < annosArray.length; i++){
		if(annosArray[i].points2D)
		    delete annosArray[i].points2D;
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
	importXmlFile: function(event){
	    console.log('AnnotationView.importXmlFile()');

	    this.loadType = 1;

	    //trigger the hidden fileLoader
	    $('#xmlInput', this.el).trigger('click');
	    event.stopPropagation(); 
	},
	loadXmlFile: function(event){
	    console.log('AnnotationView.loadXmlFile()');

	    this.loadType = 0;

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

	    var annoString = JSON.parse(inputString);

	    var annos = [];
	    if(this.loadType == 0){  //LOAD

		//deleteAllLayerViews
		for(var j = 0; j < this.annoLayerViews.length; j++){
		    this.deleteLayerView(this.annoLayerViews[j]);
		    j--; //since length is being altered on the fly
		};
		    
	    }
	    else{                   //IMPORT		
		annos = this.currentItem.get('annotations');
	    }

	    //loop through,create a display anno layer
	    for(var i = 0; i < annoString.length; i++){
		var annoObj = new Annotation();
		annoObj.label = annoString[i].label;
		annoObj.shape = annoString[i].shape;
		annoObj.color = annoString[i].color;
		annoObj.points3D = annoString[i].points3D;
		annoObj.visible = annoString[i].visible;
		annos.push(annoObj);

		this.createLayerView(annoObj);
	    }
	    this.currentItem.setAndTriggerAnnos(annos);
	    
	},
	createLayerView:function(annoObject){

	    var annoLayerItem = new AnnoItemView({
		layersModel: this.layersModel, //NEED TO PASS THIS
		annoObject: annoObject,
		currentItem: this.currentItem,
		annosView: this
	    });
	    $('#annolayerList', this.el).append(annoLayerItem.render().el);

	    this.annoLayerViews.push(annoLayerItem);

	},
	deleteLayerView:function(annoItemView){
	    console.log('AnnotationsView.deleteLayer()');

	    //remove the layerView
	    this.annoLayerViews = _.without(this.annoLayerViews, annoItemView);
	    $(annoItemView.el).remove();

	    this.updateLayers();
	},
	updateLayers:function(){
	    /* FUNCTION FOR MANAGING ARRAY AND INDECES IN CASE OF
	       OUT OF ORDER DELETION */
	    //SLIGHTLY DODGY IN TERMS OF HANDLING

	    var annos = this.currentItem.get('annotations');

	    for(var i = 0; i < this.annoLayerViews.length; i++){
		this.annoLayerViews[i].annoObject = annos[i];
	    }
	},
	updateFromModel:function(model, value, options){
	    console.log('AnnotationsView.updateFromModel()');

	    //step through layerViews and update their objects!
	    //or just remove and redraw?
	    
	    if(!model)
		model = this.currentItem;
	    if(!value)
		value = this.currentItem.get('annotations');


	    for(var i = 0; i < this.annoLayerViews.length; i++){
		this.annoLayerViews[i].annoObject = value[i];
	    }
	},
	updateModel:function(){	    
	    console.log('AnnotationView.updateModel()');
	    //update the model with current annotations
	    
	    //step through the layerViews
	    //copy the objects into array
	    //push array into current model

	    //var annoArray =  _.clone(this.currentItem.get('annotations'));
	    var annoArray = [];
	    for(var i = 0; i < this.annoLayerViews.length; i++){
		annoArray.push(this.annoLayerViews[i].annoObject);
	    }

	    
	    console.log(annoArray);
	    this.currentItem.setAndTriggerAnnos(annoArray);
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
	    
	    for(var j = 0; j < this.annoLayerViews.length; j++){
		this.deleteLayerView(this.annoLayerViews[j]);
		j--; //since length is being altered on the fly
	    };

	    var annoArray = this.currentItem.get('annotations');
	    for(var i = 0; i < annoArray.length; i++)
		this.createLayerView(annoArray[i]);



	},
    });
    return AnnotationView;
    
});
