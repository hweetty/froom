var mongoose = require('mongoose');

var Rooms = mongoose.Schema ({
    "building"     : { type: String, required: true },
    "room"         : { type: String, required: true }
});

module.exports = mongoose.model('Rooms', Rooms);

