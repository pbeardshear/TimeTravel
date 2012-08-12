//
//	socket.io connection code, and overriding some things
//

(function () {
	var _emit,
		_on,
		namespaces = {},
		__socket = io.connect();
		
	_emit = __socket.emit;
	_on = __socket.on;
	
	function handler (name, data) {
		var namespace = namespaces[name];
		for (var i = 0; i < namespace.length; i++) {
			namespace[i].call(this, data);
		}
	}
	
	__socket.emit = function (name, userData, callback) {
		var data;
		if (typeof userData === 'object') {
			userData.id = localStorage.getItem('__id') || null;
			data = userData;
		}
		else {
			var data = {
				data: userData,
				id: localStorage.getItem('__id') || null
			};
		}
		
		_emit.call(__socket, name, data, callback);
	};
	
	__socket.on = function (name, callback) {
		if (namespaces[name]) {
			namespaces[name].push(callback);
		}
		else {
			namespaces[name] = [callback];
			_on.call(__socket, name, handler.bind(this.__socket, name));
		}
	};
	
	// Set up some default handlers
	__socket.on('response', function (data) {
		if (data.success) {
			switch (data.action) {
				case 'register':
					localStorage.setItem('__id', data.id);
					break;
				case 'redirect':
					window.location.href = data.location;
					break;
				default:
					break;
			}
		}
	});
	
	// Send registration to the server
	__socket.emit('register', {}, function () {
		if (window.location.href.indexOf('rooms') != -1) {
			// User is in a room, request a join
			var roomID = window.location.href.match(/\/rooms\/(.*)/)[1]
			__socket.emit('join', { roomID: roomID });
		}
	});
	
	this.socket = __socket;
}).call(window);
