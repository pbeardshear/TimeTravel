Page = (function() {
	function addEventHandler(obj, evt, handler) {
		if(obj.addEventListener) {
			// W3C method
			obj.addEventListener(evt, handler, false);
		} else if(obj.attachEvent) {
			// IE method.
			obj.attachEvent('on'+evt, handler);
		} else {
			// Old school method.
			obj['on'+evt] = handler;
		}
	};
	
	Function.prototype.bindToEventHandler = function bindToEventHandler() {
	  var handler = this;
	  var boundParameters = Array.prototype.slice.call(arguments);
	  //create closure
	  return function(e) {
		  e = e || window.event; // get window.event if e argument missing (in IE)   
		  boundParameters.unshift(e);
		  handler.apply(this, boundParameters);
	  }
	};
	
	function newFileUploaded(data) {
		var name;
		var list = document.getElementById('list');
		var newEl = document.createElement('div');
		var imgEl = document.createElement('img');
		imgEl.src = "http://1.bp.blogspot.com/-ivx8sPkrN0E/T7oWeBCAwKI/AAAAAAAAAfw/aZoBDKIIB3o/s1600/File.png";
		var fileInfo = document.createElement('p');
		newEl.appendChild(imgEl);
		newEl.appendChild(fileInfo);
		
		list.appendChild(newEl);
	}

	return {
		init: function() {
			  filepicker.setKey('AjB_5ggM9QMO_uSoMgHNmz');
				  filepicker.makeDropPane($('#drop')[0], {
					dragEnter: function() {
						console.log('enter');
						$("#drop").html("Drop to upload").css({
							'backgroundColor': "#E0E0E0",
							'border': "1px solid #000"
						});
					},
					dragLeave: function() {
						$("#drop").html("Drop files here").css({
							'backgroundColor': "#F6F6F6",
							'border': "1px dashed #666"
						});
					},
					progress: function(percentage) {
						$("#drop").text("Uploading ("+percentage+"%)");
					},
					done: function(data) {
						$("#status").text(JSON.stringify(data[0].url));
						socket.emit('broadcast', { type: 'file', url: data[0].url });	
					}
				});
			window.addEventListener("keypress", newFileUploaded);
			var status = document.getElementById('status');
			var drop   = document.getElementById('drop');
			var list   = document.getElementById('list');
			
			if(window.FileReader) { 
			  addEventHandler(window, 'load', function() {

				
				function cancel(e) {
				  if (e.preventDefault) { e.preventDefault(); }
				  return false;
				}
			  
				// Tells the browser that we *can* drop on this target
				addEventHandler(drop, 'dragover', cancel);
				addEventHandler(drop, 'dragenter', cancel);
			  });
			} else { 
			  document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
			}
			
			// addEventHandler(drop, 'drop', function (e) {
			  // e = e || window.event; // get window.event if e argument missing (in IE)   
			  // if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
				// console.log('asdf');
			  // var dt    = e.dataTransfer;
			  // var files = dt.files;
			  // for (var i=0; i<files.length; i++) {
				// var file = files[i];
				// var reader = new FileReader();
				  
				// attach event handlers here...
			   
				// reader.readAsDataURL(file);
			  // }
			  
			
			  
			// addEventHandler(reader, 'loadend', function(e, file) {
				// var bin           = this.result; 
				// var newFile       = document.createElement('div');
				// newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
				// list.appendChild(newFile);  
				// var fileNumber = list.getElementsByTagName('div').length;
				// status.innerHTML = fileNumber < files.length 
								 // ? 'Loaded 100% of file '+fileNumber+' of '+files.length+'...' 
								 // : 'Done loading. processed '+fileNumber+' files.';
				// status.innerHTML = bin;
				// socket.emit('broadcast', {fileObject: file, data: bin});
				// var img = document.createElement("img"); 
				// img.file = file;   
				// img.src = bin;
				// list.appendChild(img);
			// }.bindToEventHandler(file));
			
			  // return false;
			// });
			
			

		}
	};
})();

window.addEventListener("load", Page.init);
