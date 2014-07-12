define(["views/NavBarView", "views/SidePanelView", "views/ViewerWindowView", "models/LayersItem"],
       function(NavBarView, SidePanelView, ViewerWindowView, LayersItem) {
	   var MainView = Backbone.View.extend({
	       initialize:function() {
		   console.log('MainView.init()');

		   //INTERESTING, NEED TO THIS KEEP FOCUS FOR SET_SIZE FUNCTION!
		   _.bindAll(this, 'setSize');

		   //used for adding key presses
		   _.bindAll(this, 'keyPressHandler');
		   $(document).bind('keypress', this.keyPressHandler);
		   
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
		   
	       },
	       keyPressHandler: function(e){
		   //console.log(e.keyCode);

		   if(e.keyCode == 49)
		       this.sidePanel.toggleBuffer(0);
		   else if(e.keyCode == 50)
		       this.sidePanel.toggleBuffer(1);
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
