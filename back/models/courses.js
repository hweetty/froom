var mongoose = require('mongoose');

var Courses = mongoose.Schema ({
    "building"     : { type: String, required: true },
    "room"         : { type: Number, required: true },
    "title"        : { type: String, required: true },
    "start_time"   : { type: Number, required: true },
    "end_time"     : { type: Number, required: true },
    "weekdays"     : { type: [ Number ], required: true }
});

module.exports = mongoose.model('Courses', Courses);

