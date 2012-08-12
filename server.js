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
	if (getRoom(req.params.id)) {
		res.sendfile(__dirname + '/client/index.html');
	}
	else {
		// No room with this id, redirect back to request
		res.redirect('/request');
	}
});

app.get('/downloads/:id', function (req, res) {
	// Send the file as a download
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
	
	socket.on('join', function (req) {
		console.log('joining', req);
		var user = getConnection(req.id),
			room = getRoom(req.roomID);
		if (room) {
			if (!user.room) {
				room.addUser(user, req.name);
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
	socket.on('request', function (req) {
		// User is registering for a new namespace
		// Check if this connection doesn't have a namespace yet
		console.log('request', req);
		var user = getConnection(req.id);
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
	
	socket.on('broadcast', function (req) {
		console.log(req);
		var user = getConnection(req.id);
		user.room.broadcast(user, req);
	});
	
});
