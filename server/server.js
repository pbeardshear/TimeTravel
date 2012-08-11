var exp = require('express'),
	io = require('socket.io'),
	app;
	
app = exp.createServer(exp.logger(), exp.bodyParser(), exp.static(__dirname + '/public'), exp.cookieParser(),
			exp.session({secret: "secret", store: mongoStore(db)}));
var base = io.listen(app);
base.sockets.on('connection', function (socket) {
	console.log('New connection', socket);
});
			
app.get('/', function (req, res) {
	res.send('hello world!');
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Server started.');
});