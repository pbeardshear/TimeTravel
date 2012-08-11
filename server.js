var exp = require('express'),
	app = exp.createServer(),
	io = require('socket.io').listen(app);
			
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client/index.html');
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Server started.');
});

io.sockets.on('connection', function (socket) {
	console.log('New connection', socket);
});
