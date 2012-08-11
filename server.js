var exp = require('express'),
	app = exp.createServer(),
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

app.get('/:id', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Server started.');
});


//
//	socket.io handlers
//
io.sockets.on('connection', function (socket) {
	// Register the connection
	registerConnection(socket);
	
	// Bind handlers for messages from the client
	socket.on('register', function () {
		// User is registering for a new namespace
		// Check if this connection doesn't have a namespace yet
		var user = getConnection(socket);
		if (!user.hasRegistered) {
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
		var user = getConnection(socket);
		user.room.broadcast(user, data);
	});
	
});
