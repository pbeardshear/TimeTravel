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
					for (var i = 0; i < data.users.length; i++) {
						userItems.push(new Page.UserItem(data.users[i], true));
					}
					break;
				case 'broadcast':
					dataItems.push(new Page.DataItem(data.sender, data.data);
					break;
			}
		}
	});
	
	function onload() {
		// Run code that requires the dom
		$('#createGroup').click(function () {
			groups.push(new Page.Group($('#groupName').val(), currentRow, currentColumn));
			column = (column + 1) % columnCount;
			if (column == 0) {
				row += 1;
			}
		});
	}
	
	// Execute when DOM is ready
	$(onload);
})();