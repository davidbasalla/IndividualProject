define(["views/NavBarView", "views/SidePanelView", "views/ViewerWindowView", "models/LayersItem"],
       function(NavBarView, SidePanelView, ViewerWindowView, LayersItem) {
	   var MainView = Backbone.View.extend({
	       initialize:function() {
		   console.log('MainView.init()');

		   //INTERESTING, NEED TO THIS KEEP FOCUS FOR SET_SIZE FUNCTION!
		   _.bindAll(this, 'setSize');
		   
		   //EVENT FOR RESIZING OF WINDOW
		   $(window).on("resize", this.setSize);		   

		   //INIT LAYERS MODEL TO KEEP TRACK OF CHANGES
		   var layersModel = new LayersItem();


		   console.log('MainView.init() navbar');
		   //INIT SUBCOMPONENTS
		   this.navBar = new NavBarView({
		       el: $('#navbar')
		   });

		   
		   console.log('MainView.init() ViewerWindowView');
		   this.viewerWindow = new ViewerWindowView({
		       el: $('#viewerWindow'),
		       layersModel: layersModel,
		   });


		   console.log('MainView.init() sidePanel');
		   this.sidePanel = new SidePanelView({
		       el: $('#sidePanel'),
		       layersModel: layersModel,
		       viewerWindowView: this.viewerWindow,
		   });


		   //this.sidePanel.viewerWindowView = this.viewerWindow;
		   
		   //set size first time
		   this.setSize();


		   //handler errors
		   var _this = this;
		   window.onerror = function (errorMsg, url, lineNumber) {

		       _this.errorHandler(errorMsg);

		   };



		   
	       },
	       errorHandler:function(errorMsg){
		   console.log('MainView.errorHandler()');


		   //ERRORS
		   var sigError = 'invalid file signature';
		   var rangeError = 'byte length of Int16Array should be a multiple of';		   
		   var rangeError2 = 'byte length of Uint16Array should be a multiple of';	       
		   var loadError = "Loading failed";
		   var splitError = "Cannot read property 'split' of";
		   var datatypeError = "Unsupported NII data type";

		   if(errorMsg.indexOf(sigError) > -1){	
		       this.showError(errorMsg);
		   }
		   else if(errorMsg.indexOf(rangeError) > -1){
		       this.showError(errorMsg);
		   }		   
		   else if(errorMsg.indexOf(rangeError2) > -1){
		       this.showError(errorMsg);
		   }
		   else if(errorMsg.indexOf(splitError) > -1){
		       this.showError(errorMsg);
		   }
		   else if(errorMsg.indexOf(loadError) > -1){
		       this.showError(errorMsg);
		   }
		   else if(errorMsg.indexOf(datatypeError) > -1){
		       this.showError(errorMsg);
		   }	   


	       },
	       showError:function(errorMsg){
		   
	       	   $('#myErrorModalTitle').html('Could not load file');
		   $('#myErrorModalBody').html(errorMsg);
		   $('#myErrorModal').modal();
		   
	       },
	       setSize:function(){
		   console.log('MainView.setSize()');

		   var w = window.innerWidth;
		   var h = window.innerHeight;

		   var navBar_height = $('#navbar').height();
		   var sidePanel_height = h - navBar_height;
		   var sidePanel_width = $('#sidePanel').width();
		   var viewerWindow_height = sidePanel_height*2;
		   var viewerWindow_width = w - sidePanel_width - 20;

		   var canvasPanels_height = sidePanel_height;
		   var canvasPanels_width = viewerWindow_width;
		   var xtkPanels_height = sidePanel_height;
		   var xtkPanels_width = viewerWindow_width;
		   
	   

		   //SET THE DIMENSIONS...
		   
		   $('#sidePanel').css({ "height": sidePanel_height});
		   
		   $('#viewerWindow').css({ "height": viewerWindow_height});
		   $('#viewerWindow').css({ "width": viewerWindow_width});

		   $('#canvasPanels').css({ "height": canvasPanels_height});
		   $('#canvasPanels').css({ "width": canvasPanels_width});
		   $('#xtkPanels').css({ "height": xtkPanels_height});
		   $('#xtkPanels').css({ "width": xtkPanels_width});

		   this.viewerWindow.setSize();
	       },
	   });
	   return MainView;
       });
