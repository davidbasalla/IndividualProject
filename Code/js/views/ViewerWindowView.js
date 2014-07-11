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
		   //console.log('ViewerWindowView.init()');

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
	       addXtkView:function(layerIndex, model){
		   console.log('ViewerWindowView.addXtkView()');

		   var xtkViewer = new XtkView({
		       layerIndex: layerIndex,
		       model: model,
		   });

		   //need to add this to some sort of array so it can be queried!
		   this.xtkViewArray[this.xtkViewArray.length] = xtkViewer;
	       },
	       removeXtkView:function(layerIndex){
		   console.log('ViewerWindowView.removeXtkView(' + layerIndex + ')');
		   /* DO I HAVE TO DO MORE HERE? */

		   for(var i = 0; i < this.xtkViewArray.length; i++){
		       if (this.xtkViewArray[i].layerIndex == layerIndex){

			   console.log('Removing this:');
			   console.log(this.xtkViewArray[i]);
			   this.xtkViewArray[i].destroy();
   			   this.xtkViewArray.splice(i,1);
			   }
		   }
	       },
	       setSizeViewerCanvas:function(){
		   console.log('ViewerWindowView.setSizeViewerCanvas()');

		   //SET canvases
		   var topbarHeight = $('#topbar').outerHeight();
		   var totalHeight0 =  $('#panel0').height();
		   var totalWidth0 =  $('#panel0').width();
		   var totalHeight1 =  $('#panel1').height();
		   var totalWidth1 =  $('#panel1').width();
		   var totalHeight2 =  $('#panel2').height();
		   var totalWidth2 =  $('#panel2').width();
		   var totalHeight3 =  $('#panel3').height();
		   var totalWidth3 =  $('#panel3').width();

		   document.getElementById("canvasViewer0").setAttribute("height", totalHeight0 - topbarHeight);
		   document.getElementById("canvasViewer0").setAttribute("width", totalWidth0);
		   document.getElementById("canvasViewer1").setAttribute("height", totalHeight1 - topbarHeight);
		   document.getElementById("canvasViewer1").setAttribute("width", totalWidth1);
		   document.getElementById("canvasViewer2").setAttribute("height", totalHeight2 - topbarHeight);
		   document.getElementById("canvasViewer2").setAttribute("width", totalWidth2);
		   document.getElementById("canvasViewer3").setAttribute("height", totalHeight3 - topbarHeight);
		   document.getElementById("canvasViewer3").setAttribute("width", totalWidth3);


	       },
	       setSizeXtkView:function(layoutIndex){
		   console.log('ViewerWindowView.setSizeXtkView()');

		   //SET xtkViewers
		   for(var i = 0; i < this.xtkViewArray.length; i++){
		       this.xtkViewArray[i].layout = layoutIndex;
		       this.xtkViewArray[i].setDimensions();
		   }

	       },
	       swapDimensions:function(dst, src){
		   console.log('ViewerWindowView.swapSize(' + dst + ',' + src + ')');
		   
		   for(var i = 0; i < this.xtkViewArray.length; i++)
		       this.xtkViewArray[i].swapDimensions(dst, src);

		   //swap viewers in the array?

		   //would it be enough to change the order of the array?


	       },
	       setSize:function(){
		   console.log('ViewerWindowView.setSize()');

		   //RESET THE GLOBAL CONTAINER DIMENSIONS

		   console.log($('#canvasPanels'));
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


	       },
	       render:function() {
		   //load the template

		   this.$el.append(this.template);
		   
		   //create the 4 different views here

		   //need to pass which CanvasSource to look at
		   this.viewer0 = new CanvasViewer2D({
	    	       el: '#panel0',
		       viewerIndex: 0,
		       viewerWindowView: this,
		       mode: 0,
		   });
		   this.viewer0.render();
		   this.viewer0.setMode(0);

		   this.viewer1 = new CanvasViewer2D({
		       el:'#panel1',
		       viewerIndex: 1,
		       viewerWindowView: this,
		       mode: 1,
		   });
		   this.viewer1.render();
		   this.viewer1.setMode(1);

		   this.viewer2 = new CanvasViewer2D({
		       el:'#panel2',
		       viewerIndex: 2,
		       viewerWindowView: this,
		       mode: 2,
		   });
		   this.viewer2.render();
		   this.viewer2.setMode(2);

		   this.viewer3 = new CanvasViewer2D({
		       el:'#panel3',
		       viewerIndex: 3,
		       viewerWindowView: this,
		       mode: 3,
		   });
		   this.viewer3.render();
		   this.viewer3.setMode(3);

		   this.viewers = [this.viewer0, this.viewer1, this.viewer2, this.viewer3];

	       },
	       setCurrentLayer:function(layersModel, value, options){

		   console.log('ViewerWindowView.setCurrentLayer()');

		   //turn OFF triggers for previous object
		       
		   if(this.currentItem)
		       this.currentItem.off("change:opacity", this.setOpacity, this);
		   
		   //get new object
		   this.currentItem = layersModel.getCurrentItem();
		   
		   //turn ON triggers for current object
		   if(this.currentItem)
		       this.currentItem.on("change:opacity", this.setOpacity, this);
		   
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
	       },
	       stopAnimation:function(){
		   this.doRender = false;
	       },
	       update:function(){
		   console.log('ViewerWindowView.update()');
		   console.log(this);

		   //issue with settimeout and refreshing webGl canvas, so not using that

		   var _this = this;
		   var time = new Date().getTime();

		   function draw() {
		   
		       //console.log('draw');
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
		       
		       //console.log(this.doRender);
		       
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
	       scroll:function(){
		   
		   ////console.log('ViewerWindowView.scroll()');

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


	   });
	   return ViewerWindowView;
       });
