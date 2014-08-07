define(["views/CanvasViewer3D", 
	"views/CanvasViewer2D", 
	"text!templates/ViewerWindow.html",
	"views/XtkView",],
       function(CanvasViewer3D, 
		CanvasViewer2D, 
		ViewerWindowTemplate,
		XtkView)
       {
	   var ViewerWindowView = Backbone.View.extend({
	       el:'#viewerWindow',
	       template: _.template(ViewerWindowTemplate),
	       initialize:function(options) {
		   console.log('ViewerWindowView.init()');

		   _.bindAll(this, 'update');

		   //set the current layer
		   this.layersModel = options.layersModel;

		   //DETECT CHANGES IN LAYERS MODEL
		   this.layersModel.on("change", this.setCurrentLayer, this);

		   Backbone.on('onShowtime', this.startAnimation, this);
		   Backbone.on('setLayout', this.setLayout, this);

		   this.currentItem = null;
		   this.xtkViewArray = [];

		   this.layout = 1;

		   this.render();
		   this.doRender = false;
		   this.renderRunning = false;

		   //this.setSize();
	       },
	       render:function() {
		   console.log('ViewerWindowView.render()');
		   //load the template

		   this.$el.append(this.template);
		   
		   //create the 4 different views here

		   //need to pass which CanvasSource to look at
		   console.log('ViewerWindowView.render() 0');
		   this.viewer0 = new CanvasViewer3D({
	    	       el: '#panel0',
		       viewerWindowView: this,
		       panelId : 0,  //keeps track of positioning
		       mode: 0  //keep track of mode ie 3D/X/Y/Z, stays the same
		   });

		   console.log('ViewerWindowView.render() 1');
		   this.viewer1 = new CanvasViewer2D({
		       el:'#panel1',
		       viewerWindowView: this,
		       panelId : 1,
		       mode: 1
		   });

		   this.viewer2 = new CanvasViewer2D({
		       el:'#panel2',
		       viewerWindowView: this,
		       panelId : 2,
		       mode: 2
		   });

		   this.viewer3 = new CanvasViewer2D({
		       el:'#panel3',
		       viewerWindowView: this,
		       panelId : 3,
		       mode: 3
		   });

		   this.viewers = [this.viewer0, this.viewer1, this.viewer2, this.viewer3];
		   this.renderCanvasViewers();
	       },
	       renderCanvasViewers:function(){
		   console.log('ViewerWindowView.renderCanvasViewers()');

		   for(index in this.viewers){
		       console.log('Rendering - ' + this.viewers[index].el);
		       this.viewers[index].render();
		   }
	       },
	       resetPanels:function(srcPanel, dstIndex){
		   console.log('ViewerWindowView.resetPanels(' + srcPanel + ',' + dstIndex + ')');

		   //find the destination panel
		   var dstPanel = "";
		   for(index in this.viewers){
		       if(this.viewers[index].mode == dstIndex){
			   dstPanel = this.viewers[index].el;
		       }
		   }

		   //determine which views to change
		   var viewer1;
		   var viewer2;

		   for(index in this.viewers){
		       if(this.viewers[index].el == srcPanel){
			   viewer1 = this.viewers[index];
		       }
		       if(this.viewers[index].el == dstPanel){
			   viewer2 = this.viewers[index];
		       }
		   }

		   //keep the order intact
		   var tmp = viewer1.panelId;
		   viewer1.panelId = viewer2.panelId;
		   viewer2.panelId = tmp;

		   //unhook events
		   viewer1.undelegateEvents();
		   viewer2.undelegateEvents();

		   //change el's
		   viewer1.setPanel(dstPanel);
		   viewer2.setPanel(srcPanel);

		   //transfer viewer-settings such as overlay
		   this.transferSettings(viewer1, viewer2);

		   //re-render the views with the new el's
		   this.renderCanvasViewers();

		   //need to swap the xtkDimensions to keep track of positioning
		   //can't rerender these due to complex initiation
		   this.swapXtkDimensions(viewer1.panelId, viewer2.panelId);

		   //change size
		   this.setSize();
	       },
	       transferSettings:function(viewer1, viewer2){
		   /* swap out settings such as showoverlay toggle */

		   var overlay1 = viewer1.showOverlay;
		   var overlay2 = viewer2.showOverlay;

		   if(overlay1)
		       viewer2.showOverlay = true;
		   else
		       viewer2.showOverlay = false;

		   if(overlay2)
		       viewer1.showOverlay = true;
		   else
		       viewer1.showOverlay = false;
		   
	       },
	       addXtkView:function(layerIndex, model){
		   //console.log('ViewerWindowView.addXtkView()');

		   var xtkViewer = new XtkView({
		       layerIndex: layerIndex,
		       model: model,
		       layout: this.layout,
		   });

		   //need to add this to some sort of array so it can be queried!
		   this.xtkViewArray[this.xtkViewArray.length] = xtkViewer;
	       },
	       removeXtkView:function(layerIndex){
		   console.log('ViewerWindowView.removeXtkView(' + layerIndex + ')');
		   /* DO I HAVE TO DO MORE HERE? */

		   for(var i = 0; i < this.xtkViewArray.length; i++){
		       if (this.xtkViewArray[i].layerIndex == layerIndex){

			   //console.log('Removing this:');
			   //console.log(this.xtkViewArray[i]);
			   this.xtkViewArray[i].destroy();
   			   this.xtkViewArray.splice(i,1);
			   }
		   }
	       },
	       setSize:function(){
		   //console.log('ViewerWindowView.setSize()');

		   //RESET THE GLOBAL CONTAINER DIMENSIONS

		   var height = $('#canvasPanels').height() - 20;
		   var width = $('#canvasPanels').width() - 20;
		   
		   $('#panel0').show();
		   $('#panel1').show();
		   $('#panel2').show();
		   $('#panel3').show();

		   if(this.layout == 1){
		       //SET PANELS
		       $('#panel0').css({ "height": height/2,
					  "width": width/2});
		       $('#panel1').css({ "height": height/2,
					  "width": width/2});
		       $('#panel2').css({ "height": height/2,
					  "width": width/2});
		       $('#panel3').css({ "height": height/2,
					  "width": width/2});
		   }
		   else if (this.layout == 2){
		       $('#panel0').css({ "height": height,
				      "width": width*(2/3)});
		       $('#panel1').css({ "height": height/3 - 6,
					  "width": width*(1/3)});
		       $('#panel2').css({ "height": height/3 - 6,
					  "width": width*(1/3)});
		       $('#panel3').css({ "height": height/3 - 6,
					  "width": width*(1/3)});
		   }
		   else if (this.layout == 3){
		       $('#panel0').css({ "height": height*(2/3),
					  "width": width});
		       $('#panel1').css({ "height": height*(1/3),
					  "width": width/3 - 6});
		       $('#panel2').css({ "height": height*(1/3),
					  "width": width/3 - 6});
		       $('#panel3').css({ "height": height*(1/3),
					  "width": width/3 - 6});
		   }
		   else if (this.layout == 4){
		       $('#panel0').css({ "height": height,
					  "width": width});
		       $('#panel1').hide();
		       $('#panel2').hide();
		       $('#panel3').hide();

		   }
		   //SET xtkView sizes
		   this.setSizeXtkView(this.layout);

		   //SET viewer canvases dimensions
		   this.setSizeViewerCanvas();


		   this.viewer0.update();
		   this.viewer1.update();
		   this.viewer2.update();
		   this.viewer3.update();

	       },
	       setSizeViewerCanvas:function(){
		   //console.log('ViewerWindowView.setSizeViewerCanvas()');

		   //SET canvases
		   var topbarHeight0 = $('#topbar0').outerHeight();
		   var totalHeight0 =  $('#panel0').height();
		   var totalWidth0 =  $('#panel0').width();

		   var topbarHeight1 = $('#topbar1').outerHeight();
		   var totalHeight1 =  $('#panel1').height();
		   var totalWidth1 =  $('#panel1').width();

		   var topbarHeight2 = $('#topbar2').outerHeight();
		   var totalHeight2 =  $('#panel2').height();
		   var totalWidth2 =  $('#panel2').width();

		   var topbarHeight3 = $('#topbar3').outerHeight();
		   var totalHeight3 =  $('#panel3').height();
		   var totalWidth3 =  $('#panel3').width();


		   var maxTopbarHeight = Math.max(topbarHeight0, topbarHeight1, topbarHeight2, topbarHeight3);
		   console.log('maxTopBarHeight = ' + maxTopbarHeight);

		   //set topbars to max (SET WHOLE CLASS)
		   $('.topbar').css({ "height": maxTopbarHeight});

		   //set canvasViewer div dimensions
		   document.getElementById("canvasViewer0").setAttribute("height", totalHeight0 - maxTopbarHeight);
		   document.getElementById("canvasViewer0").setAttribute("width", totalWidth0);
		   document.getElementById("canvasViewer1").setAttribute("height", totalHeight1 - maxTopbarHeight);
		   document.getElementById("canvasViewer1").setAttribute("width", totalWidth1);
		   document.getElementById("canvasViewer2").setAttribute("height", totalHeight2 - maxTopbarHeight);
		   document.getElementById("canvasViewer2").setAttribute("width", totalWidth2);
		   document.getElementById("canvasViewer3").setAttribute("height", totalHeight3 - maxTopbarHeight);
		   document.getElementById("canvasViewer3").setAttribute("width", totalWidth3);


	       },
	       setSizeXtkView:function(layoutIndex){
		   //console.log('ViewerWindowView.setSizeXtkView()');

		   //SET xtkViewers
		   for(var i = 0; i < this.xtkViewArray.length; i++){
		       this.xtkViewArray[i].layout = layoutIndex;
		       this.xtkViewArray[i].setDimensions();
		   }

	       },
	       swapXtkDimensions:function(dstIndex, srcIndex){
		   //console.log('ViewerWindowView.swapSize(' + dst + ',' + src + ')');
		   
		   for(var i = 0; i < this.xtkViewArray.length; i++)
		       this.xtkViewArray[i].swapDimensions(dstIndex, srcIndex);

		   //swap viewers in the array?

		   //would it be enough to change the order of the array?
	       },
	       setCurrentLayer:function(layersModel, value, options){

		   console.log('ViewerWindowView.setCurrentLayer()');
		   console.log(this.currentItem);

		   //turn OFF triggers for previous object
		       
		   if(this.currentItem){
		       this.currentItem.off("change:opacity", this.setOpacity, this);
		       this.currentItem.off("change:annotations", this.setAnnotations, this);
		   }
		   
		   //get new object
		   this.currentItem = layersModel.getCurrentItem();
		   
		   //turn ON triggers for current object
		   if(this.currentItem){
		       this.currentItem.on("change:opacity", this.setOpacity, this);
		       this.currentItem.on("change:annotations", this.setAnnotations, this);
		   }
		   

		   //declare vars
		   
		   var itemA = layersModel.getCurrentItem();
		   var itemB = layersModel.getOtherItem();
		   
		   //if currently A
		   if(layersModel.getCurrentItem() == itemA){
		       this.viewer0.setCurrentLayers(itemA, itemB);
		       this.viewer1.setCurrentLayers(itemA, itemB);
		       this.viewer2.setCurrentLayers(itemA, itemB);
		       this.viewer3.setCurrentLayers(itemA, itemB);
		   }
		   else{
		       this.viewer0.setCurrentLayers(itemB, itemA);
		       this.viewer1.setCurrentLayers(itemB, itemA);
		       this.viewer2.setCurrentLayers(itemB, itemA);
		       this.viewer3.setCurrentLayers(itemB, itemA);
		   }
		   if(this.currentItem)
		       this.setOpacity(null, this.currentItem.get('opacity'), null);
	       

	       },
	       startAnimation:function(){
		   this.doRender = true;
		   //this.update();               //start render

		   //check if recursive loop is already running
		   if(!this.renderRunning){
		       console.log('START RENDER');
		       this.update();
		       this.renderRunning = true;   //set to renderRunning
		   }
		   else
		       console.log('RENDER ALREADY RUNNING!');
	       },
	       stopAnimation:function(){
		   this.doRender = false;
	       },
	       update:function(){
		   console.log('ViewerWindowView.update() - start animation loop');
		   //console.log(this);

		   //issue with settimeout and refreshing webGl canvas, so not using that

		   var _this = this;
		   var time = new Date().getTime();

		   function draw() {
		   
		       ////console.log('draw');
		       var now = new Date().getTime();
		       //only draw the frame if 25 milliseconds have passed!
		       if(now > (time + 25)){

			   // Drawing code goes here
			   _this.viewer0.draw();
			   _this.viewer1.draw();
			   _this.viewer2.draw();
			   _this.viewer3.draw();
			   
			   time = now;
		       }
		       //requestAnimationFrame(draw);
		       
		       ////console.log(this.doRender);
		       
		       if(_this.doRender)
			   requestAnimationFrame(draw);
	   	       else{
			   _this.setToBlack();
			   _this.renderRunning = false;
		       }
		   }
		   //start off the loop
		   requestAnimationFrame(draw);	   
		   
	       },
	       setOpacity:function(model, value, options){
		   console.log('setOpacity(' + value + ')');

		   this.viewer0.setOpacity();
		   this.viewer1.setOpacity();
		   this.viewer2.setOpacity();
		   this.viewer3.setOpacity();
	       },
	       setToBlack:function(){

		   this.viewer0.setToBlack();
		   this.viewer1.setToBlack();
		   this.viewer2.setToBlack();
		   this.viewer3.setToBlack();

	       },
	       setAnnotations:function(model, value, options){
		   console.log('ViewerWindowView.setAnnotations()');
		   //passing annotation item to CanvasViewers

		   //check if array is non-empty
		   if(value){
		   //if(this.currentItem.get('annotations')){
		       var annoArray = value;
		       console.log(annoArray);
		       
		       this.viewer0.setAnnotations(annoArray);
		       this.viewer1.setAnnotations(annoArray);
		       this.viewer2.setAnnotations(annoArray);
		       this.viewer3.setAnnotations(annoArray);
		   }
	       },
	       scroll:function(){
		   
		   //////console.log('ViewerWindowView.scroll()');

		   if(this.currentItem){
		       var oldX = this.currentItem.get('indexX');
		       if(e.originalEvent.wheelDelta < 0)
			   this.currentItem.set({
			       indexX: oldX - 1,
			   });
		       else
			   this.currentItem.set({
			       indexX: oldX + 1,
			   });
		   }
	       },
	       setLayout:function(value){

		   this.layout = value;
		   this.setSize();
	       },
	       setVolumeRender:function(value){

		   //SET xtkViewers
		   for(var i = 0; i < this.xtkViewArray.length; i++){
		       this.xtkViewArray[i].setVolumeRender(value);
		   }

	       }
	   });
	   return ViewerWindowView;
       });
