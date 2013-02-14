/*jshint browser:true, laxcomma:true, indent:2 */

document.addEventListener('DOMContentLoaded', function () {
  alert('init');
  initDnD();
});


function initDnD() {
  document.getElementById("body").addEventListener("dragenter", onDragEnter, false);
  document.getElementById("drop-box-overlay").addEventListener("dragleave", onDragLeave, false);
  document.getElementById("drop-box-overlay").addEventListener("dragover", noopHandler, false);
  document.getElementById("drop-box-overlay").addEventListener("drop", onDrop, false);
}

function noopHandler(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function onDragEnter(evt) {
  
}

function onDragLeave(evt) {
  if (evt.pageX < 10 || evt.pageY < 10 || $(window).width() - evt.pageX < 10  || $(window).height - evt.pageY < 10) {
    $("#drop-box-overlay").fadeOut(125);
    $("#drop-box-prompt").fadeOut(125);
  }
}

function onDrop(evt) {
  var files = evt.dataTransfer.files;
  
  if (typeof files === "undefined" || files.length === 0) {
    return;
  }
  
  uploadFile(files[0]);
  noopHandler(evt);
}

function uploadFile(file) {
  var reader = new FileReader();
  
  reader.onerror = function (evt) {
    var message;
    
    // REF: http://www.w3.org/TR/FileAPI/#ErrorDescriptions
    switch (evt.target.error.code) {
    case 1:
      message = file.name + " not found.";
      break;
        
    case 2:
      message = file.name + " has changed on disk, please re-try.";
      break;
      
    case 3:
      messsage = "Upload cancelled.";
      break;
      
    case 4:
      message = "Cannot read " + file.name + ".";
      break;
      
    case 5:
      message = "File too large for browser to upload.";
      break;
    }
    
    alert(message);
  };
  
  reader.onloadend = function (evt) {
    var data = evt.target.result;

    data = data.substring(data.indexOf(',') + 1);
    console.log('data', data);
  };

  reader.readAsDataURL(file);
}
