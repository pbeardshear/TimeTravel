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
				'<div class="outerCircle">',
					'<div class="circle">',
						'<div class="groupName">{groupName}</div>',
						'<span class="loadingText">0</span>',
					'</div>',
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
	// Hashset of the users we are displaying
	var users = { },
		everyoneGroup = null;

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
		if (!users[this.name] && !stringOnly) {
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
						dropTarget.updateCount();
					}
				}
				dragCount = 0;
				dropTarget = null;
			}.bind(this));
			users[this.name] = 1;
			// Creating a new user, add it to the "everyone"  group
			if (!everyoneGroup.contains(this)) {
				everyoneGroup.users.push(this);
				everyoneGroup.updateCount();
			}
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
			this.data = '<a href="' + data.url + '">' + (data.name || data.fileName) + '</a>';
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
		this.users = [];
		
		var html = groupTemplate.join('');
		html = html.replace('{color}', this.color).replace('{id}', this.id).replace('{groupName}', this.name);
		this.el = $(html);
		this.el.css({ top: this.y, left: this.x });
		$(containers.groups).append(this.el);
		$('#' + this.id).draggable();
		
		this.el.on('mouseenter', function () {
			var content = '';
			// Load the tooltip
			$('#tiptip_content').empty();
			for (var i = 0; i < this.users.length; i++) {
				content += (new Page.UserItem(this.users[i].name, this.users[i].active, true)).html;
			}
			if (!content) {
				content += '<p>There are no users in this group.<br />Add users by dragging them from the right.</p>';
			}
			// Prepend the header text
			content = '<p class="tipGroupName">' + this.name + '</p>' + content;
			$('#tiptip_content').append(content);
		}.bind(this));
		if (this.name.length > 8) {
			this.el.find('.groupName').css('font-size', '10px');
		}
		this.el.on('dragenter', function () {
			dropTarget = this;
			dragCount += 1;
		}.bind(this));
		this.el.on('dragleave', function () {
			dragCount -= 1;
		});
		this.el.on('dragstop', function () {
			this.x = this.el.css('left');
			this.y = this.el.css('top');
		}.bind(this));
		this.el.on('click', function () {
			console.log('clicked');	
			var tip = $('#tiptip_content');
			tip.empty();
			tip.append('<p>Press enter to send a message</p><textarea id="textMessage"></textarea>');
			$('#textMessage').focus();
		});
		
		Page.attachFilepicker(this.id);
		Page.createUserTooltip(this.id);
		
		if (this.name.toLowerCase() === 'everyone') {
			everyoneGroup = this;
		}
	};
	Page.Group.prototype = {
		remove: function () {
			$(this.el).remove();
		},
		
		moveTo: function (x, y) {
			this.x = x;
			this.y = y;
			$(this.el).css({ top: y, left: x });
		},
		
		updateCount: function () {
			// Sets the count text in this group to this size of the user array
			$(this.el).find('.loadingText').text(this.users.length);
		},
		
		getUserNames: function () {
			return this.users.map(function (u) { return { name: u.name, active: u.active }; });
		},
		
		contains: function (user) {
			for (var i = 0; i < this.users.length; i++) {
				if (this.users[i].name === user.name) {
					return true;
				}
			}
			return false;
		}
	};
})();