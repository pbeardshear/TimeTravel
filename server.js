var exp = require('express'),
	app = exp.createServer(exp.logger(), exp.bodyParser(), exp.static(__dirname + '/client')),
	io = require('socket.io').listen(app);
	// Load in app-specific code
require('./server/app');
//
// 	Static routing
//
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

app.get('/request', function (req, res) {
	res.sendfile(__dirname + '/client/request.html');
});

app.get('/rooms/:id', function (req, res) {
	res.sendfile(__dirname + '/client/endpoint.html');
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Server started.');
});


//
//	socket.io handlers
//
io.sockets.on('connection', function (socket) {
	// Register the connection
	socket.on('register', function (data, cb) {
		if (!data.id) {
			// New user
			registerConnection(socket);
		}
		else {
			// Reset the connection this user is on
			resetSocket(data.id, socket);
		}
		cb && cb();
	});
	
	socket.on('join', function (data) {
		console.log('joining', data);
		var user = getConnection(data.id),
			room = getRoom(data.roomID);
		if (room) {
			if (!user.room) {
				room.addUser(user);
			}
		}
		else {
			// Redirect back to the request page
			socket.emit('response', {
				success: false,
				action: 'redirect',
				location: baseURL + '/request'
			});
		}
	});
	 
	// Bind handlers for messages from the client
	socket.on('request', function (data) {
		// User is registering for a new namespace
		// Check if this connection doesn't have a namespace yet
		var user = getConnection(data.id);
		if (!user.room) {
			user.generateNamespace();
		}
		// Redirect to their existing namespace
		socket.emit('response', {
			success: true,
			action: 'redirect',
			location: baseURL + user.namespace
		});
	});
	
	socket.on('broadcast', function (data) {
		console.log(data);
		var user = getConnection(data.id);
		user.room.broadcast(user, data);
	});
	
});
