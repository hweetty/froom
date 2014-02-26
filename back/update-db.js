//Require main modules
var mongoose = require("mongoose"),
	fs 		 = require("fs");

//Load configuration file
var config = JSON.parse(fs.readFileSync("./config.json"));

//Connect to database
if (!config.mongodb.username) {
	mongoose.connect("mongodb://localhost/" + config.mongodb.database);
}
else {
	mongoose.connect("mongodb://" + config.mongodb.username + ":" + config.mongodb.password + "@" + config.mongodb.domain + "/" + config.mongodb.database);
}

mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
var Courses = require ("./models/courses.js");
var helper  = require ("./controllers/helper.js");



exports.updateDB = function (req, res)
{
    console.log("updating \n");

    var buildings = {"MC": [4059, 
    // 1351
    ]};
    buildings = helper.BUILDINGS;
    var keys = Object.keys(buildings);
    var total = 0, parsed = 0;

    for (var i in keys)
    {
        var b = keys[i];
        var rooms = buildings[b];
        total += rooms.length;

        // var room = new Rooms ({
        //     buildings : b,
        //     room      : r
        // })
        // room.save();

        for (var j in rooms)
        {
            var r = rooms[j];
            var u = helper.urlForBuildingRoom(b, r);

            helper.query (u, function (d)
            {
            	var data = d.data;
                for (var k in data)
                {
                    // console.log(data[k]);
                    // console.log("\n\n");

                    var course = new Courses ({
                        "building"     : data[k].building,
                        "room"         : data[k].room,
                        "title"        : data[k].title,
                        "start_time"   : helper.timeFromString(data[k].start_time),
                        "end_time"     : helper.timeFromString(data[k].end_time),
                        "weekdays"     : helper.daysFromString(data[k].weekdays)
                    });
                    course.save(function (e) {
                        if (e) { 
                            console.log("error saving:");
                            console.log(e);
                        }
                    });
                    console.log(course);
                }
                
                parsed ++;
                if (parsed == parsed)
                	console.log("\nDone !\nRequests: " + d.meta.requests);
            });

        } // for j in rooms
    } // for i in keys
}



console.log("Updating DB !");
Courses.remove (function () {
	console.log("removed old stuff...");
    exports.updateDB();
});
