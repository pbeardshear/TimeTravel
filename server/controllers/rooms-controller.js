//
//	room-controller.js
//

module.exports = {
	show: function (req, res) {
		console.log('\n\nSHOWING\n\n');
		if (getRoom(req.params.id)) {
			console.log('SENDING', req.params.id);
			console.log('BASE', dir, '\n\n');
			res.sendfile(dir + '/client/room.html');
		}
		else {
			// No room with this id, redirect back to request
			res.redirect('/');
		}
	}
};
