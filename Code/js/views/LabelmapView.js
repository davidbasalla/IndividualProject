define(["text!templates/Labelmap.html"], 
       function(LabelmapTemplate) {
    
    var LabelmapView = Backbone.View.extend({
	//define the template
	template: _.template(LabelmapTemplate),
	initialize:function(options) {
	    this.currentItem = null;//item for detecting changes
	    this.layersModel = options.layersModel;

	    this.render();
	},	
	events: {	    		
	    'change input#labelmapVisible': 'toggleVisibility',	    
	    'click button#loadLabelmapFile': 'loadFile',	    
	    'change input#labelmapPicker': 'fileLoaded',	    
	    'change select#labelmapLookupSelector': "setLookup",
	},
	render:function() {

	    this.$el.html(this.template);
	    
	    $( "#labelmapOpacitySlider" ).slider({
		min: 0,
		max: 100,
		value: 100,
		slide: function( event, ui ) {
		    $( "#labelmapOpacityInput" ).val(ui.value);
		    Backbone.trigger('labelmapOpacityChange', ui.value);
		}
	    });

	    //$( document ).tooltip();


	    $('#labelmapPicker', this.el).hide();

	    this.setReadOnly(true);
	},	
	loadFile: function(event){
	    //trigger the hidden fileLoader
	    $('#labelmapPicker',this.el).trigger('click');
	    event.stopPropagation(); 
	},	
	fileLoaded: function(e){
	    console.log('LabelmapView.fileLoaded()')
	    //add text to layer preview
	    $('#textHolder', this.el).html(e.currentTarget.files[0].name);
	    
	    this.currentItem.set({
		labelmapFile : e.currentTarget.files[0]
	    });
	},
	setCurrentItem:function(currentItem){
	    console.log('LabelmapView.setCurrentItem()');

	    if(this.currentItem){
		this.currentItem.off("change:annotations", this.updateFromModel, this);
	    }
	    
	    //get new object
	    this.currentItem = currentItem;
	    
	    //turn ON triggers for current object
	    if(this.currentItem){
		this.currentItem.on("change:annotations", this.updateFromModel, this);
	    }

	    this.setReadOnly(false);
	    if(!currentItem)
		this.setReadOnly(true);
	    else
		if(!currentItem.get('file') || !currentItem.get('loaded'))
		    this.setReadOnly(true);

	    this.setSettings(currentItem);
	},
	setSettings:function(currentItem){
	    //would have to reset the annotations here!!
	    
	    //need to restore labelmap file name
	    //need to restore opacity 
	    //need to restore colorindex

	    var selectIndex = 0;
	    var label = "No File Selected";
	    var opacity = 100;

	    if(currentItem){
		selectIndex = currentItem.get("labelmapColortable");
		if(currentItem.get("labelmapFile"))
		   label = currentItem.get("labelmapFile").name;
		opacity = currentItem.get("labelmapOpacity");
	    }
	    $('#textHolder', this.el).html(label);
	    $( "#labelmapOpacityInput" ).val(opacity);
	    $( "#labelmapOpacitySlider").slider('value', opacity);

	    $('#labelmapLookupSelector option').eq(selectIndex).prop('selected', true);
	},
	setLabelmap:function(){
	    console.log('LabelmapView.setLabelmap()');
	    //Backbone.trigger('labelmapChange');
	    
	    var file = 'http://x.babymri.org/?seg.nrrd';
	    
	    this.currentItem.set({labelmap: file});


	},
	toggleVisibility:function(){
	    console.log('LabelmapView.toggleVis()');

	    var val = this.currentItem.get('labelmapVisible');

	    this.currentItem.set({
		labelmapVisible: !val
	    });    
	},
	setLookup:function(e){
	    console.log('LabelmapView.setLookup()');
	    //console.log(e);

	    this.currentItem.set({
		labelmapColortable: e.currentTarget.selectedIndex
	    });    
	},
	setReadOnly:function(value){


	    //disable file buttons	    
	    $("#loadLabelmapFile", this.el).attr("disabled", value);
	    $("#delete", this.el).attr("disabled", value);


	    if(value){
		$("#labelmapOpacitySlider").slider("disable");
	    }
	    else{
		$("#labelmapOpacitySlider").slider("enable");
	    }
	    
	    //disable settings
	    $("#labelmapOpacityInput").attr("disabled", value);


	    $("#labelmapLookupSelector").attr("disabled", value);
	},

    });
    return LabelmapView;
    
});
