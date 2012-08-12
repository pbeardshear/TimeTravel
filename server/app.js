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
		namespace.addUser(this);
		this.namespace = uid;
		this.hasRegistered = true;
	},
	
	send: function (blob) {
		// Remove the id property from the data we are sending
		delete blob.id;
		this.__socket.emit('response', {
			success: true,
			action: 'broadcast',
			data: blob
		});
	}
};

function BigRoom () {
	this.users = [];
}

BigRoom.prototype = {
	addUser: function (user) {
		user.room = this;
		this.users.push(user);
	},
	
	broadcast: function (user, data) {
		// Send the data out to all users, except the one passed in
		for (var i = 0; i < this.users.length; i++) {
			if (this.users[i].id != user.id) {
				this.users[i].send(data);
			}
		}
	}
};



//
// 	Public
//
baseURL = 'http://localhost:3000/rooms/';

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
