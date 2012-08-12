Page.Manager = (function () {
	var userItems = [],
		dataItems = [],
		groups = [];
		
	var row = 0,
		column = 0,
		rowCount = 10,
		columnCount = 10;
		
	socket.on('response', function (data) {
		if (data.success) {
			switch (data.action) {
				case 'users':
					if (data.data.users) {
						for (var i = 0; i < data.data.users.length; i++) {
							userItems.push(new Page.UserItem(data.data.users[i], true));
						}
					}
					else {
						userItems.push(new Page.UserItem(data.data.name, true));
					}
					break;
				case 'broadcast':
					var newData = new Page.DataItem(data.sender, data.data);
					dataItems.push(newData);
					document.getElementsByClassName('icon')[dataItems.length - 1].animate({top: '0px'});
					break;
			}
		}
	});
	
	function saveGroups() {
		var serial = JSON.stringify(groups.map(function (g) { return { name: g.name, x: g.x, y: g.y, color: g.color, users: g.getUserNames() }; }));
		// Save the user's groups in local storage
		localStorage.setItem('__groups', serial);
	}
	
	function createGroup(name, skipSave) {
		var group;
		if (name) {
			groups.push(group = new Page.Group(name, row, column));
			column = (column + 1) % columnCount;
			if (column == 0) {
				row += 1;
			}
			
			if (!skipSave) {
				saveGroups();
			}
			return group;
		}
	}
	
	function onload() {
		// Run code that requires the dom
		$('#createGroup').click(function () {
			var groupName = $('#groupName').val();
			createGroup(groupName);
		});
		
		$('#groupName').on('focus', function () {
			$('#addCircle').css('opacity', '1.0');
		});
		$('#groupName').on('blur', function () {
			$('#addCircle').css('opacity', '0.5');
		});
		
		// Load the groups, if the user has any
		var groups = localStorage.getItem('__groups'),
			group;
		if (groups) {
			// Deserialize the object
			groups = JSON.parse(groups);
			for (var i = 0; i < groups.length; i++) {
				group = createGroup(groups[i].name, true);
				group.moveTo(groups[i].x, groups[i].y);
				for (var j = 0; j < groups[i].users.length; j++) {
					group.users.push(new Page.UserItem(groups[i].users[j].name, groups[i].users[j].active));
				}
				group.updateCount();
			}
		}
		else {
			createGroup('Everyone', true);
		}
		
		$(window).on('keydown', function (e) {
			if (e.target.id === 'textMessage' && e.keyCode === 13) {
				// Send message
				// For some reason this is getting called a bunch of times on enter...
				if (e.target.value) {
					socket.emit('broadcast', e.target.value);
				}
				e.target.value = "";
				
				e.preventDefault();
				e.stopPropagation();
			}
		});
		
		window.onbeforeunload = function () {
			saveGroups();
		};
	}
	
	// Execute when DOM is ready
	$(onload);
})();
