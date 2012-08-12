Page = (function() {
	function newFileUploaded(data) {
		data = data.data;
		
		if (data && data.users) {
			var name;
			var list = document.getElementById('list');
			var newEl = document.createElement('a');
			newEl.href = data.url;
			
			var imgEl = document.createElement('img');
			imgEl.src = "http://1.bp.blogspot.com/-ivx8sPkrN0E/T7oWeBCAwKI/AAAAAAAAAfw/aZoBDKIIB3o/s1600/File.png";
			
			var fileInfo = document.createElement('p');
			fileInfo.innerHTML = 'File Name: ' + data.name + '<br>' + 'File Size: ' + data.size + '<br>' + 'File Type: ' + data.fileType;
			
			newEl.appendChild(imgEl);
			newEl.appendChild(fileInfo);
			
			list.appendChild(newEl);
		}
		else {
			//user alerting crap
		}
	}

	function attachFilepicker(id) {
		filepicker.makeDropPane($('#' + id)[0], {
		dragEnter: function() {
			console.log('enter');
			$("#" + id).html("Drop to upload").css({
				//circle expansion here
	
			});
		},
		dragLeave: function() {
			$("#" + id).html("Drop files here").css({
				//circle unexpansion here

			});
		},
		progress: function(percentage) {
			$("#" + id).text(percentage+ "%");
			
		},
		done: function(data) {
			$("#status").text(JSON.stringify(data[0].url));
			socket.emit('broadcast', { name: data[0].data.filename, size: data[0].data.size, fileType: data[0].data.type, type: 'file', url: data[0].url });
		}
	});
	}
	
	function createUserTooltip(id) {
		$('#status').tooltip({ 
			track: true, 
			delay: 0, 
			showURL: false, 
			opacity: 1, 
			fixPNG: true, 
			showBody: " - ", 
			extraClass: "pretty fancy", 
			top: -15, 
			left: 5 
		}); 
	}
	
	function createSendTextFileTooltip() {
	
	}
	
	return {
		init: function() {
			filepicker.setKey('AjB_5ggM9QMO_uSoMgHNmz');
					
			window.addEventListener("keypress", newFileUploaded);
			socket.on('response', newFileUploaded);
			var status = document.getElementById('status');
			var drop   = document.getElementById('drop');
			var list   = document.getElementById('list');
			
			createUserTooltip();	
		}
	};
})();

window.addEventListener("load", Page.init);
