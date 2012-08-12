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
					var newData = new Page.DataItem(data.sender, data.data)
					dataItems.push(newData);
					document.getElementsByClassName('icon')[dataItems.length - 1].animate({top: '0px'});
					break;
			}
		}
	});
	
	function onload() {
		// Run code that requires the dom
		$('#addCircle').click(function () {
			groups.push(new Page.Group($('#groupName').val(), row, column));
			column = (column + 1) % columnCount;
			if (column == 0) {
				row += 1;
			}
		});
	}
	
	// Execute when DOM is ready
	$(onload);
})();
