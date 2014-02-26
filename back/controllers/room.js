
var Courses = require ("../models/courses.js");
var Rooms   = require ("../models/rooms.js");
var helper  = require ("../controllers/helper.js");


// Change to a 10 min interval
function parseTime (t)
{
    t = parseInt(t);
    var h = Math.floor(t / 100);
    var m = t % 100;
    return h*6 + Math.floor(m / 10);
}

// Gets a dict of time specified in the req, or the current time in Eastern Time Zone
// {day: 0, time: 60} // 10:00am on a Monday
function getTimeFromRequest(req)
{
    var date = new Date;
    // Offset timezone if needed
    var time = date.getTime() - 100*(date.getTimezoneOffset() - 300);
    date = new Date(time);
    // console.log(date);


    var t = req.query.time, d = req.query.day;
console.log("top:   day: " + d + " t: " + t);
    if (!t)
        t = date.getHours()*100 + date.getMinutes();
     
     t = parseTime(t);

console.log("getDate() :" + date.getDate());
    if (!d)
        d = (date.getDay()+6) % 7; // 'rotate' so that 0 is monday
    else
        d = helper.daysFromString(d)[0]; // Use first entry

console.log("day: " + d + " t: " + t);

    // Error check
    if (t < 0 || t > 24*6 || d < 0 || d > 6)
        return false;
    return { day:d, time:t };
}

exports.getFull = function (req, res)
{
    console.log("room get full");
    var date = getTimeFromRequest(req);
    if (!date) {
        helper.sendRes(res, "Invalid time or day", null, 400);
    }

    // console.log(date);
    var d = date.day, t = date.time;
    // console.log("date :" + d + "  time :" + t);

    Courses.find ({
        "weekdays"   : { $in: [d] },
        "start_time" : { $lte: t},
        "end_time"   : { $gte: t}
    }, function(e, courses) {
        console.log(e);
        console.log(courses);
        if (!e && courses)
            helper.sendRes(res, "ok", courses);
        else
            helper.sendRes(res, "Error finding courses", null, 400);
    });
}

exports.getFree = function (req, res)
{
    console.log("room get free");
    var date = getTimeFromRequest(req);
    if (!date) {
        helper.sendRes(res, "Invalid time or day", null, 400);
    }

    // console.log(date);
    var d = date.day, t = date.time;
    // console.log("date :" + d + "  time :" + t);

    Courses.find ({
        "weekdays"   : { $in: [d] },
        "start_time" : { $lte: t},
        "end_time"   : { $gte: t}
    }, function(e, courses)
    {
        if (!e && courses)
        {
            // Go through all rooms and eliminate those that are not free
            var buildings = JSON.parse(JSON.stringify(helper.BUILDINGS)); // :)

            var fullBuildings = {};
            for (var i in courses)
            {
                var c = courses[i];
                var rooms = buildings[c.building];

                if (!rooms)
                    console.log("ERROR: rooms not found: " + c);
                else
                {
                    var j = rooms.indexOf(c.room);
                    if (j >= 0) {
                        rooms.splice(j, 1);
                    }
                }
            } // For

            // sort
            var keys = Object.keys(buildings);
            for (var i in keys)
            {
                buildings[keys[i]].sort();
            }

            helper.sendRes(res, "ok", buildings);
        }
        else
            helper.sendRes(res, "Error finding courses", null, 400);
    });
}


exports.updateDB = function (req, res)
{
    console.log("updating \n");

    var buildings = {"MC": [4059, 
    // 1351
    ]};
    buildings = helper.BUILDINGS;
    var keys = Object.keys(buildings);

    for (var i in keys)
    {
        var b = keys[i];
        var rooms = buildings[b];

        var room = new Rooms ({
            buildings : b,
            room      : r
        })
        // room.save();

        for (var j in rooms)
        {
            var r = rooms[j];
            var u = helper.urlForBuildingRoom(b, r);

            helper.query (u, function (data)
            {
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
            });

        } // for j in rooms
    } // for i in keys
}



// TESTING
update = false;
if (update) {

Courses.remove (function () {
    exports.updateDB();
});
}



console.log(helper.urlForBuildingRoom("MC", 4020));
// API has duplicate: 
// Physiological and Biochemical Aspects of Nutrition and Health
// https://api.uwaterloo.ca/v2/buildings/MC/4020/courses.json?key=bc9ee79a136cbccdf82c4ff7169a5ab0
// rooom 4020


