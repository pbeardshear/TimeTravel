var https = require('https'),
	exp = require('express'),
	app = exp.createServer(exp.logger(), exp.bodyParser(), exp.static(__dirname + '/client')),
	io = require('socket.io').listen(app);
	
// Load in app-specific code
require('./server/app');
require('./server/routes')(app);
require('./server/socket-routes')(io);

// Set the base directory for other modules to use
global.dir = __dirname;

app.listen(process.env.PORT || 3000, function () {
	console.log('Server started.');
});

console.log('Defined routes:', app.routes.all().map(function (route) { return route.path; }));
