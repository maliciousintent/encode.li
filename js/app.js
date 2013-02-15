/*jshint browser:true, laxcomma:true, indent:2 */

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
  // public method for encoding
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
 
    input = Base64._utf8_encode(input);
 
    while (i < input.length) {
 
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
 
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
 
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
 
      output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
    }
 
    return output;
  },
 
  // public method for decoding
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
 
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
    while (i < input.length) {
 
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
 
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
 
      output = output + String.fromCharCode(chr1);
 
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
 
    }
 
    output = Base64._utf8_decode(output);
 
    return output;
 
  },
 
  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
 
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
 
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
 
    return utftext;
  },
 
  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = ""
      , i = 0
      , c = 0
      , c2 = 0
      , c3 = 0;
 
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
 
    return string;
  }
};


/* encode.li begin */

var _processFile = function (file) {
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
      message = "Upload cancelled.";
      break;
      
    case 4:
      message = "Cannot read " + file.name + ".";
      break;
      
    case 5:
      message = "File too large for browser to upload.";
      break;
    }
    
    document.getElementById('error').innerHTML = message;
  };
  
  reader.onloadend = function (evt) {
    var data = evt.target.result;

    data = data.substring(data.indexOf(',') + 1);
    document.getElementById('container64').innerHTML = 'data:image;base64,' + data;
  };

  reader.readAsDataURL(file);
};

var noopHandler = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
};

var onDragEnter = function () {
  
};

var onDragLeave = function () {
  
};

var onDrop = function (evt) {
  var files = evt.dataTransfer.files;
  
  if (typeof files === "undefined" || files.length === 0) {
    return;
  }
  
  _processFile(files[0]);
  noopHandler(evt);
};

var initDnD = function () {
  document.getElementsByTagName("body")[0].addEventListener("dragenter", onDragEnter, false);
  document.getElementById("dropArea").addEventListener("dragleave", onDragLeave, false);
  document.getElementById("dropArea").addEventListener("dragover", noopHandler, false);
  document.getElementById("dropArea").addEventListener("drop", onDrop, false);
  
  document.getElementById('container64').addEventListener("click", function (e) {
    e.target.select();
  });
};


document.addEventListener('DOMContentLoaded', function () {
  initDnD();
}, false);


