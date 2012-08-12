//
//	View objects
//

(function () {
	// Private
	var userTemplate = [
			'<div class="userItem" draggable="true">',
				'<div class="inline activeCircle"><img src="/images/{active}.png" /></div>',
				'<div class="inline userName">	',
					'<span>{name}</span>',
				'</div>',
			'</div>',
			'<div class="separator"></div>'
		],
		dataTemplate = [
			'<div class="dataItem">',
				'<div class="inline icon">{icon}</div>',
				'<div class="inline wrapper">',
					'<div class="user">{user}:</div>',
					'<div class="userData">{data}</div>',
				'</div>',
			'</div>',
			'<div class="separator"></div>'
		],
		groupTemplate = [
			'<div class="group {color}" id="{id}">',
				'<div class="groupName">{groupName}</div>',
				'<div class="circle">',
					'<span class="loadingText"></span>',
				'</div>',
			'</div>'
		];
	
	var colors = ['red', 'blue', 'green', 'orange', 'yellow', 'purple'];
	var groupIndex = 0,
		rowSize = 150,
		columnSize = 150;
	var containers = {
		users: '#userList',
		data: '#fileList',
		groups: '#circleArea'
	};

	var dropTarget = null,
		dragCount = 0;
	// Public
	Page.UserItem = function (name, active, stringOnly) {
		this.name = name;
		this.active = active;
		
		// Create the HTML to encapsulate this element
		var html = userTemplate.join('');
		// Replace the template with data
		html = html.replace('{name}', this.name).replace('{active}', this.active ? 'green' : 'gray');
		if (!stringOnly) {
			this.el = $(html);
			$(containers.users).append(this.el);
			this.el.on('dragstart', function (e) {
				dragging = true;
			});
			this.el.on('dragend', function (e) {
				if (dragCount > 0) {
					// We dropped onto a circle group
					// Add ourselves to that group
					console.log('successful drop');
					// Only allow drops if the user doesn't already belong to this group
					if (dropTarget.users.indexOf(this) == -1) {
						dropTarget.users.push(this);
					}
				}
				dragCount = 0;
				dropTarget = null;
			}.bind(this));
		}
		else {
			this.html = html;
		}
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
	
	Page.DataItem = function (user, data) {
		this.user = user;
		this.data = data.data;
		this.icon = data.type === 'file' ? '<img src="/images/file.png">' : '<img src="/images/talk.png">';
		this.size = data.size;
		
		if (data.type === 'file') {
			this.data = '<a href="' + data.url + '">' + data.fileName + '</a>';
		}
		
		var html = dataTemplate.join('');
		html = html.replace('{user}', this.user).replace('{data}', this.data).replace('{icon}', this.icon).replace('{size}', this.size);
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
		this.id = 'group-' + (groupIndex++);
		this.row = row;
		this.column = column;
		// Computed properties
		this.color = colors.splice(Math.floor(Math.random() * colors.length), 1);
		this.x = this.column * columnSize;
		this.y = this.row * rowSize;
		console.log(this.y);
		this.users = [];
		
		var html = groupTemplate.join('');
		html = html.replace('{color}', this.color).replace('{id}', this.id).replace('{groupName}', this.name);
		this.el = $(html);
		this.el.css({ top: this.y, left: this.x });
		$(containers.groups).append(this.el);
		
		this.el.on('mouseenter', function () {
			var content = '';
			// Load the tooltip
			$('#tiptip_content').empty();
			for (var i = 0; i < this.users.length; i++) {
				content += (new Page.UserItem(this.users[i].name, this.users[i].active, true)).html;
			}
			$('#tiptip_content').append(content);
		}.bind(this));
		this.el.on('dragenter', function () {
			dropTarget = this;
			dragCount += 1;
		}.bind(this));
		this.el.on('dragleave', function () {
			dragCount -= 1;
		});
		this.el.on('click', function () {
			console.log('clicked');
			$(window).on('keydown', function (e) {
				if (e.target.id === 'textMessage' && e.keyCode === 13) {
					// Send message
					socket.emit('broadcast', e.target.value);
					e.target.value = "";
					
					e.preventDefault();
					e.stopPropagation();
				}
			});
		});
		
		Page.attachFilepicker(this.id);
		Page.createUserTooltip(this.id);
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