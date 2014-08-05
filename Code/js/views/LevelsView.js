define(["text!templates/Levels.html", "models/AnnotationItem"], function(LevelsTemplate, AnnoItem) {
    
    var LevelsView = Backbone.View.extend({
	//define the template
	template: _.template(LevelsTemplate),
	initialize:function() {
	    this.currentItem = null;//item for detecting changes

	    this.render();
	},	
	events: {
	    'change input#indexX': 'setIndexInputHandler',
	    'change input#indexY': 'setIndexInputHandler',
	    'change input#indexZ': 'setIndexInputHandler',
	    'change input#levelLow': 'setLevelInputHandler',
	    'change input#levelHigh': 'setLevelInputHandler',
	    'change input#thresholdLow': 'setThresholdInputHandler',
	    'change input#thresholdHigh': 'setThresholdInputHandler',
	    'change select': "setLookup",	    
	    'change input#xmlInput': 'xmlFileSelected',
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

	    
	    //set up listener to change of file field

	},
	xmlFileSelected:function(e){
	    console.log('LevelsView.xmlFileSelected()');

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

	    console.log('LevelsView.parseXML()');

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
	    var colorXML = $(xmlDoc).find('color');
	    var color =[];
	    color[0] = Number($(colorXML).find('R')[0].childNodes[0].nodeValue);  
	    color[1] = Number($(colorXML).find('G')[0].childNodes[0].nodeValue);  
	    color[2] = Number($(colorXML).find('B')[0].childNodes[0].nodeValue);  


	    //CREATE ANNOTATION MODEL INSTANCE
	    var annoItem = new AnnoItem();
	    annoItem.set({
		// modify item defaults
		label: label,
		points: pointsArray,
		color: color
	    });


	    //UPDATE CURRENT ITEM
	    //have to use clone method as otherwise change method does not get fired!
	    //do with pointer to array!?
	    //from STACKOVERFLOW...
	    var annoArray = _.clone(this.currentItem.get('annotations'));
	    annoArray.push(annoItem);

	    this.currentItem.set({
		annotations: annoArray,
	    });

	    console.log(this.currentItem.get('annotations'));
	    console.log(this.currentItem);
	},
	setCurrentItem:function(currentItem){
	    console.log('LevelsView.setCurrentItem()');

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

	    this.setSliders(currentItem);
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
	setIndexX:function(model, indexX, options){
	    $( "#indexX" ).val(indexX);
	},
	setIndexY:function(model, indexY, options){
	    $( "#indexY" ).val(indexY);
	},
	setIndexZ:function(model, indexZ, options){
	    $( "#indexZ" ).val(indexZ);
	},
	setIndexInputHandler:function(e){
	    console.log('LevelsView.setIndexInputHandler()');
	    /* ADD A MAX HERE, BUT CURRENTLY DIFFICULT DUE THAT
	       INFO NOT BEING AVAILABLE IN XTK */

	    var val = Number(e.target.value);

	    if(this.currentItem){

		if(e.target.id == 'indexX'){
		    this.currentItem.set({indexX: val});
		}
		else if(e.target.id == 'indexY'){
		    this.currentItem.set({indexY: val});
		}
		else if(e.target.id == 'indexZ'){
		    this.currentItem.set({indexZ: val});
		}
	    }
	},
	setOpacityInputHandler:function(e){
	    console.log('LevelsView.setIndexInputHandler()');

	    //guard against non-number input
	    if(isNaN(e.target.value)){
		if(this.currentItem){
		    $( "#opacityInput" ).val(this.currentItem.get('opacity'));
	       	    $("#opacitySlider").slider('value', this.currentItem.get('opacity')); 
		}
		else{
		    $( "#opacityInput" ).val(100);
	       	    $("#opacitySlider").slider('value', 100); 
		}
		console.log('Error: Non-number input');
	    }
	    else{
		
		var val = Number(e.target.value);
		
		/*guard against out of bounds inputs*/
		if(val < 0){
		    val = 0;
		    $( "#opacityInput" ).val(0);
		}
		else if(val > 100){
		    val = 100;
		    $( "#opacityInput" ).val(100);
		}
		
		//set
		if(this.currentItem){
		    //update model
		    this.currentItem.set({opacity: val});
	    	    $("#opacitySlider").slider('value', val); 
		}
	    }
	},
	setLevelInputHandler:function(e){

	    var low = 0;
	    var high = 100;
	    var lowOrig = 0;
	    var highOrig = 100;

	    if(this.currentItem){
		low = this.currentItem.get('windowLow');
		high = this.currentItem.get('windowHigh');
		lowOrig = this.currentItem.get('windowLowOrig');
		highOrig = this.currentItem.get('windowHighOrig');
	    }

	    //guard against non-number input, reset to original values
	    if(isNaN(e.target.value)){
		console.log('Error: Non-number input');

		$( "#levelLow" ).val(low);
		$( "#levelHigh" ).val(high);
		$("#rangeSlider1").slider('values', 0, low); 
		$("#rangeSlider1").slider('values', 1, high);
	    }
	    else{
		//guard against out of bounds input
		if(e.target.id == "levelLow"){
		    low = Number(e.target.value);
		    if(low < lowOrig)
			low = lowOrig;
		    else if(low > highOrig)
			low = highOrig;
		}
		else if (e.target.id == "levelHigh"){
		    high = Number(e.target.value);
		    if(high > highOrig){
			high = highOrig;}
		    else if(high < lowOrig)
			high = lowOrig;
		}
		
		//set
		if(this.currentItem){
		    //update model
		    this.currentItem.set({
			windowLow: low,
			windowHigh: high
		    });
		    $( "#levelLow" ).val(low);
		    $( "#levelHigh" ).val(high);

		    $("#rangeSlider1").slider('values', 0, low); 
		    $("#rangeSlider1").slider('values', 1, high);
		}
	    }

	},
	setThresholdInputHandler:function(e){

	    var low = 0;
	    var high = 100;
	    var lowOrig = 0;
	    var highOrig = 100;

	    if(this.currentItem){
		low = this.currentItem.get('thresholdLow');
		high = this.currentItem.get('thresholdHigh');
		lowOrig = this.currentItem.get('thresholdLowOrig');
		highOrig = this.currentItem.get('thresholdHighOrig');
	    }

	    //guard against non-number input, reset to original values
	    if(isNaN(e.target.value)){
		console.log('Error: Non-number input');

		$( "#thresholdLow" ).val(low);
		$( "#thresholdHigh" ).val(high);
		$("#rangeSlider2").slider('values', 0, low); 
		$("#rangeSlider2").slider('values', 1, high);
	    }
	    else{
		//guard against out of bounds input
		if(e.target.id == "thresholdLow"){
		    low = Number(e.target.value);
		    if(low < lowOrig)
			low = lowOrig;
		    else if(low > highOrig)
			low = highOrig;
		}
		else if (e.target.id == "thresholdHigh"){
		    high = Number(e.target.value);
		    if(high > highOrig){
			high = highOrig;}
		    else if(high < lowOrig)
			high = lowOrig;
		}
		
		//set
		if(this.currentItem){
		    //update model
		    this.currentItem.set({
			thresholdLow: low,
			thresholdHigh: high
		    });
		    $( "#thresholdLow" ).val(low);
		    $( "#thresholdHigh" ).val(high);

		    $("#rangeSlider2").slider('values', 0, low); 
		    $("#rangeSlider2").slider('values', 1, high);
		}
	    }

	},
	setSliders:function(currentItem){
	    //console.log('LayersView.resetSliders()');

	    //set original values
	    var wLO = currentItem.get("windowLowOrig");
	    var wHO = currentItem.get("windowHighOrig");
	    var tLO = currentItem.get("thresholdLowOrig");
	    var tHO = currentItem.get("thresholdHighOrig");	    

	    $("#rangeSlider1").slider('option',{min: wLO, max: wHO});
	    $("#rangeSlider2").slider('option',{min: tLO, max: tHO}); 
	},

	setWindowOrigValues:function(value){
	    console.log('setWindowLowOrig');

	    console.log($( "#rangeSlider1" ));
	    //set slider range values correctly
	    //set the number correctly
	    
	},
	setLookup:function(value){
	    console.log('LevelsView.setLookup()');
	    console.log(value);
	    Backbone.trigger('lookupChange', value.currentTarget.selectedIndex);

	},

    });
    return LevelsView;
    
});
