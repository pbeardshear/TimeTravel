//
//	View objects
//

(function () {
	// Private
	var userTemplate = [
			'<div class="userItem">',
				'<div class="inline activeCircle {active}"></div>',
				'<div class="inline userName">',
					'<span>{name}</span>',
				'</div>',
			'</div>'
		],
		dataTemplate = [
			'<div class="dataItem">',
				'<div class="inline icon">{icon}</div>',
				'<div class="inline wrapper">',
					'<div class="user">{user}</div>',
					'<div class="userData">{data}</div>',
				'</div>',
			'</div>'
		],
		groupTemplate = [
			'<div class="group {color}" id="{id}">',
				'<div class="groupName">{groupName}</div>',
				'<div class="circle"></div>',
			'</div>'
		];
	
	var colors = [];
	var groupIndex = 0;
	var containers = {
		users: '#userList',
		data: '#fileList',
		groups: '#circleArea'
	};

	// Public
	Page.UserItem = function (name, active) {
		this.name = name;
		this.active = active;
		
		// Create the HTML to encapsulate this element
		var html = userTemplate.join('');
		// Replace the template with data
		html = html.replace('{name}', this.name).replace('{active}', this.active ? 'active' : 'inactive');
		this.el = $(html);
		$(containers.users).append(this.el);
	};
	Page.UserItem.prototype = {
		remove: function () {
			$(this.el).remove();
		},
		
		setActive: function (active) {
			var child = $(this.el).children().first();
			this.active = active;
			if (active) {
				child.addClass('active').removeClass('inactive');
			}
			else {
				child.addClass('inactive').removeClass('active');
			}
		}
	};
	
	Page.DataItem = function (user, data, icon) {
		this.user = user;
		this.data = data;
		this.icon = icon;
		
		if (data.type === 'file') {
			this.data = '<a href="' + data.url + '">' + data.fileName + '</a>';
		}
		
		var html = dataTemplate.join('');
		html = html.replace('{user}', this.user).replace('{data}', this.data).replace('{icon}', icon);
		this.el = $(html);
		$(containers.data).append(this.el);
	};
	Page.DataItem.prototype = {
		remove: function () {
			$(this.el).remove();
		}
	};


	Page.Group = function (name, row, column) {
		// Get a random color
		this.name = name;
		this.row = row;
		this.column = column;
		// Computed properties
		this.color = colors.splice(Math.floor(Math.random() * colors.length), 1);
		this.x = this.column * columnSize;
		this.y = this.row * rowSize;
		
		var html = groupTemplate.join('');
		html = html.replace('{color}', this.color).replace('{id}', 'group-' + (groupIndex++)).replace('{groupName}', this.name);
		this.el = $(html);
		this.el.css({ top: y, left: x });
		$(containers.groups).append(this.el);
	};
	Page.Group.prototype = {
		remove: function () {
			$(this.el).remove();
		},
		
		moveTo: function (x, y) {
			$(this.el).css({ top: y, left: x });
		}
	};
})();