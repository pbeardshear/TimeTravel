//
// 	Private
//
var connections = {},
	namespaces = {};

// Utility methods
function UID (a) {
	return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e3]+-1e3).replace(/[01]/g, UID);
}

function User (socket) {
	this.__socket = socket;
	this.id = socket.id;
	this.name = '';
	this.hasRegistered = false;
	this.hasConnected = false;
	this.room = null;
	this.namespace = null;
}

User.prototype = {
	generateNamespace: function () {
		var namespace = new BigRoom(),
			uid = UID();
		namespaces[uid] = namespace;
		this.namespace = uid;
	},
	
	send: function (blob, type) {
		// Remove the id property from the data we are sending
		console.log('blob', blob);
		delete blob.id;
		this.__socket.emit('response', {
			success: true,
			action: (type || 'broadcast'),
			data: blob
		});
	}
};

function BigRoom () {
	this.users = [];
}

BigRoom.prototype = {
	addUser: function (user, name) {
		user.room = this;
		user.name = name;
		// Give the new user the list of users in this room
		console.log('sending to user');
		user.send({ users: this.users.map(function (user) { return user.name; }) }, 'users');
		this.users.push(user);
		// Broadcast the user joining to all other users in the room
		console.log('broadcasting');
		this.broadcast(user, {
			name: name
		}, 'users');
	},
	
	broadcast: function (user, data, type) {
		var userList = data.users ? this.users.filter(function (user) { return data.users.indexOf(user.name) != -1; }) : this.users;
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].id != user.id) {
				this.users[i].send(data, type);
			}
		}
	}
};


//
// 	Public
//
baseURL = 'http://localhost:3000/';

registerConnection = function (socket) {
	connections[socket.id] = new User(socket);
	socket.emit('response', {
		success: true,
		action: 'register',
		id: socket.id
	});
};

resetSocket = function (id, socket) {
	var user = connections[id];
	if (user) {
		user.__socket = socket;
	}
	else {
		// The user has an idea, but we don't recognize it,
		// so generate another valid one for them
		registerConnection(socket);
	}
};

getConnection = function (id) {
	return connections[id] || null;
};

getRoom = function (id) {
	return namespaces[id] || null;
};
