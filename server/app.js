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
	
	send: function (data) {
		this.__socket.emit('response', {
			success: true,
			data: data
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
baseURL = 'http://localhost:3000/';

registerConnection = function (socket) {
	connections[socket.id] = new User(socket);
	socket.emit('response', {
		success: true,
		id: socket.id
	});
};

getConnection = function (socket) {
	return connections[socket.id] || null;
};

