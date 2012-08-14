//
//	routes.js
//
//	Defines express routes for each defined controller
//	Routes are matched to the names of the controllers
//	(e.g. controllers/home-controller.js will have its methods in '/home/')
//

var requiredir = require('../lib/requiredir');

module.exports = function (app) {
	// Get the controllers
	var controllers = requiredir('server/controllers'),
		controller,
		base,
		route;
	
	for (var name in controllers) {
		if (controllers.hasOwnProperty(name)) {
			base = name.indexOf('-controller') ? name.split('-')[0] : name;
			// Establish routes based on controllers methods
			controller = controllers[name];
			for (var method in controller) {
				if (controller.hasOwnProperty(method)) {
					switch (method) {
						case 'index':
							route = '/' + base;
							app.get(route, controller[method]);
							break;
						case 'show':
							route = '/' + base + '/:id';
							app.get(route, controller[method]);
							break;
						case 'update':
							route = '/' + base + '/:id';
							app.post(route, controller[method]);
							break;
						case 'add':
							route = '/' + base;
							app.post(route, controller[method]);
							break;
					}
				}
			}
		}
	}
	
};
