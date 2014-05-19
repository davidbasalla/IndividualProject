function myFunction()
{
  console.log('Loading the viewer')



    //get file from viewer
    var filePicker = document.getElementById("filePicker");
    console.log(filePicker);
    console.log(filePicker.value);
    console.log(filePicker.files[0]);

    var fileName = filePicker.files[0];



    var reader = new FileReader();

    reader.onload = function(e) {
        console.log("File Read!");   
        console.log(this.result);   

         // create a X.volume
          volume = new X.volume();

          //volume.file = this.result;
          volume.file = 'http://x.babymri.org/?vol.nrrd';

          sliceX.add(volume);
          sliceX.render();
        }

    reader.readAsDataURL(fileName);


    //load file into volume

    // create the 2D renderers
  // .. for the X orientation
  sliceX = new X.renderer2D();
  sliceX.container = 'sliceX';
  sliceX.orientation = 'X';
  sliceX.init();
}
    


