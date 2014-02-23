module.exports = function(app) {

    var room = require('./controllers/room.js');
	var pre = '/1/';

    app.get (pre + "update", room.updateDB);

    app.get (pre + 'rooms/full', room.getFull);
	app.get (pre + 'rooms/free', room.getFree);
}


