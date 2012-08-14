//
//	socket.io handlers
//

module.exports = function (io) {
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
		
		socket.on('disconnecting', function (req) {
			// user disconnected
			console.log('disconnected');
			var user = getconnection(socket.id);
			if (user) {
				user.active = false;
			}
		});
		
		socket.on('join', function (req) {
			console.log('joining', req);
			var user = getConnection(req.id),
				room = getRoom(req.roomID);
			if (room) {
				if (!user.room) {
					room.addUser(user, req.name);
				}
				else {
					// User has a room, but is rejoining
					// send out a message to all users
					user.room.broadcast(user, { name: user.name }, 'rejoin');
					user.send({ users: user.room.users.map(function (user) { return user.active && user.name; }) }, 'users');
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
				location: baseURL + 'rooms/' + user.namespace
			});
		});
		
		socket.on('broadcast', function (req) {
			console.log(req);
			var user = getConnection(req.id);
			user.room.broadcast(user, req);
		});
		
		socket.on('email', function (req) {
			console.log('sending email');
			// req.users is a list of { email: '...', data: '...' }
			
			// TEST
			var request = https.request({
				host: 'sendgrid.com',
				path: '/api/mail.send.xml?api_user=youremail@domain.com&api_key=secureSecret&to=destination@example.com&toname=Destination&subject=Example%20Subject&text=testingtextbody&from=info@domain.com',
				method: 'POST'
			});
			
			var postData = {
				'api_user': '',
				'api_key': '',
				// Send to multiple users, I think this is the way to do it
				'to': [],
				'toName': [],
				'subject': '',
				'html': '',
				'from': ''
			};
			// END TEST
			
			request.write(postData);
			request.end();
		});
		
		socket.on('text', function (req) {
			console.log('sending text');
			// req.users is a list of { number: '...', data: '...' }
			// This won't work until we get an API key from Twilio...
			
			// TEST
			var request = https.request({
				host: 'api.twilio.com',
				path: '/2010-04-01/Accounts/AC85649c3c22e709eefda8fb2ec46a4192/SMS/Messages.json',
				method: 'GET'
			});
			
			var postData = {
				"body": "Jenny please?! I love you <3",
				"from": "+14158141829",
				"to": "+14159352345"
			};
			// END TEST
			
			request.write(postData);
			// Send the request
			request.end();
		});
	});
}