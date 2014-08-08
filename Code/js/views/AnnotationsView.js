define(["text!templates/Annotation.html"], function(AnnotationTemplate) {
    
    var AnnotationView = Backbone.View.extend({
	//define the template
	template: _.template(AnnotationTemplate),
	initialize:function() {
	    this.currentItem = null;//item for detecting changes

	    this.render();
	},	
	events: {	    
	    'change input#xmlInput': 'xmlFileSelected',
	},
	render:function() {

	    this.$el.html(this.template);

	},
	xmlFileSelected:function(e){
	    console.log('AnnotationView.xmlFileSelected()');

	    console.log(e);

	    var xmlFile = e.currentTarget.files[0];

	    /*
	      this.currentItem.set({
	      annoFileName: e.currentTarget.files[0].name,
	      annoFile : e.currentTarget.files[0]
	      });*/

	    
	    //XML FILE READING
	    var reader = new FileReader();

	    var _this = this;
	    reader.onload = function(e){
		(_this.parseXML(reader.result)); // bind the current type
	    }

	    reader.readAsText(xmlFile);

	},
	parseXML:function(inputString){

	    console.log('AnnotationView.parseXML()');

	    console.log(this.currentItem.get('annotations'));

	    if (window.DOMParser)
	    {
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(inputString, "text/xml");
	    }
	    else // Internet Explorer
	    {
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(inputString);
	    }


	    //USE JQUERY TO FIND POINTS
	    //console.log(xmlDoc.getElementsByTagName("points")[0].childNodes[0]);
	    
	    var pointsArray = [];
	    var points = $(xmlDoc).find('point');
	    console.log(points);
	    for (var i = 0; i < points.length; i++){
		var point = [];
		point[0] = Number($(points[i]).find('X')[0].childNodes[0].nodeValue);
		point[1] = Number($(points[i]).find('Y')[0].childNodes[0].nodeValue);
		point[2] = Number($(points[i]).find('Z')[0].childNodes[0].nodeValue);
		pointsArray[i] = point;
	    }


	    //LABEL	    
	    var label = $(xmlDoc).find('label');
	    label = label[0].childNodes[0].nodeValue;


	    //COLOR	    
	    var color = $(xmlDoc).find('color');
	    color = color[0].childNodes[0].nodeValue;

	    var annoObject = {
		label: label,
		points3D: pointsArray,
		points2D: [],
		color: color
	    };


	    //UPDATE CURRENT ITEM
	    //have to use clone method as otherwise change method does not get fired!
	    //do with pointer to array!?
	    //from STACKOVERFLOW...
	    var annoArray = _.clone(this.currentItem.get('annotations'));
	    annoArray.push(annoObject);

	    this.currentItem.set({
		annotations: annoArray,
	    });

	    //console.log(this.currentItem.get('annotations'));
	    //console.log(this.currentItem);
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
