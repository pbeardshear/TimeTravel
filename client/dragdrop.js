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
						socket.emit('broadcast', { name: data[0].data.filename, size: data[0].data.size, fileType: data[0].data.type, type: 'file', url: data[0].url });
					}
				});
			window.addEventListener("keypress", newFileUploaded);
			socket.on('response', newFileUploaded);
			var status = document.getElementById('status');
			var drop   = document.getElementById('drop');
			var list   = document.getElementById('list');
		}
	};
})();

window.addEventListener("load", Page.init);
