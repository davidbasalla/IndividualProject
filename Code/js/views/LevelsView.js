define(["text!templates/Levels.html"], function(LevelsTemplate) {
    
    var LevelsView = Backbone.View.extend({
	//define the template
	template1: _.template(LevelsTemplate),
	initialize:function() {
	    this.currentItem = null;//item for detecting changes

	    this.currentTab = 0;

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

	    if(this.currentTab == 0){

		this.$el.html(this.template1);

		console.log($( "#rangeSlider1" ));


		var _this = this;
		$( "#rangeSlider1" ).slider({
		    range: true,
		    min: 0,
		    max: 100,
		    values: [ 0, 100 ],
		    //onslide
		    slide: function( event, ui ) {
			_this.setLevels(ui.values[0], ui.values[1]);
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
	    }


	    $("#indexX", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#indexY", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#indexZ", this.el).tooltip({delay: { show: 500, hide: 100 }});

	    $("#levelLow", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#levelHigh", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#thresholdLow", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#thresholdHigh", this.el).tooltip({delay: { show: 500, hide: 100 }});

	    $("#opacityInput", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    $("#lookupSelector", this.el).tooltip({delay: { show: 500, hide: 100 }});
	    //$("#textHolder", this.el).tooltip({delay: { show: 500, hide: 100 }});


	    //set to readyOnly by default
	    this.setReadOnly(true);
	    

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

	    console.log(currentItem);


	    this.setReadOnly(false);
	    if(!currentItem)
		this.setReadOnly(true);
	    else
		if(!currentItem.get('file') || !currentItem.get('loaded'))
		    this.setReadOnly(true);

	    this.setSliders(currentItem);
	    this.setSettings(currentItem);
	},
	setSettings:function(currentItem){
	    
	    //set text value

	    var wL = 0;
	    var wH = 100;
	    var tL = 0;
	    var tH = 100;
	    var o = 100;
	    var indexX = 0;
	    var indexY = 0
	    var indexZ = 0;
	    var selectIndex = 0;

	    if(currentItem){
		wL = currentItem.get("windowLow");
		wH = currentItem.get("windowHigh");
		tL = currentItem.get("thresholdLow");
		tH = currentItem.get("thresholdHigh");
		o = currentItem.get("opacity");
		indexX = currentItem.get("indexX");
		indexY = currentItem.get("indexY");
		indexZ = currentItem.get("indexZ");
		selectIndex = currentItem.get("colortable");
	    }

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

	    $('#lookupSelector option').eq(selectIndex).prop('selected', true);

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
	setLevels:function(low, high){

	    if(this.currentItem){
		$( "#levelLow" ).val(low);
		$( "#levelHigh" ).val(high);
		Backbone.trigger('levelsChange', [low, high]);
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

	    var wLO = 0;
	    var wHO = 100;
	    var tLO = 0;
	    var tHO = 100;

	    if(currentItem){
		wLO = currentItem.get("windowLowOrig");
		wHO = currentItem.get("windowHighOrig");
		tLO = currentItem.get("thresholdLowOrig");
		tHO = currentItem.get("thresholdHighOrig");
	    }


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

	    console.log(value.currentTarget.selectedIndex);

	    Backbone.trigger('lookupChange', value.currentTarget.selectedIndex);

	},
	setReadOnly:function(value){
	    console.log('LevelsView.setReadOnly()');
	    console.log(value);

	    

	    //1 read only
	    //0 openUP
	    //set up listener to change of file field
	    $("#indexX").attr("disabled", value);
	    $("#indexY").attr("disabled", value);
	    $("#indexZ").attr("disabled", value);


	    $("#levelLow").attr("disabled", value);
	    $("#levelHigh").attr("disabled", value);
	    $("#thresholdLow").attr("disabled", value);
	    $("#thresholdHigh").attr("disabled", value);	   

	    if(value){
		$("#rangeSlider1").slider("disable");
		$("#rangeSlider2").slider("disable");
		$("#opacitySlider").slider("disable");
	    }
	    else{
		$("#rangeSlider1").slider("enable");
		$("#rangeSlider2").slider("enable");
		$("#opacitySlider").slider("enable");
	    }
	    

	    $("#opacityInput").attr("disabled", value);

	    $("#lookupSelector").attr("disabled", value);


	}
    });
    return LevelsView;
    
});
