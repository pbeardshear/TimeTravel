//
// Request a directory of files, and bind them
// to a namespace based on the path to the file
// (e.g. 'path/to/file' would put an object in path.to.file,
//	based on the module found in file.js)
//
var fs = require('fs');

var requiredir = function (path, recursive, args, root) {
	root = root || {};
	args = args || [];
	var base = process.cwd(),
		hierarchy = path.split('/'),
		current = root,
		// args = Array.prototype.slice.call(arguments, 2),
		filenames,
		name;
	// for (var i = 0; i < hierarchy.length; i++) {
		// name = hierarchy[i];
		// if (!current[name]) {
			// current[name] = {};
		// }
		// current = current[name];
	// }
	filenames = fs.readdirSync(path);
	for (var i = 0; i < filenames.length; i++) {
		// Check if this is a file or a folder
		var isFile = fs.statSync(path + '/' + filenames[i]).isFile();
		if (isFile) {
			// Split the filename into name and extension
			var split = filenames[i].match(/(?:(.*)\.(\w+))/);
			if (split != null) {
				var name = split[1],
					extension = split[2];
				if (extension === 'js') {
					current[name] = require(base + '/' + path + '/' + name);
					if (typeof current[name] === 'function' && args.length) {
						current[name] = current[name].apply(global, args);
					}
				}
			}
			else {
				console.warn('requiredir :: Unable to "require" file ', filenames[i]);
			}
		}
		else if (recursive) {
			current[filenames[i]] = {};
			// Directory, only handle if we are recursing
			requiredir(path + '/' + filenames[i], recursive, args, current[filenames[i]]);
		}
	}
	return root;
};

module.exports = requiredir;
