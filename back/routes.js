module.exports = function(app) {

    var express = require("express");
    var room = require("./controllers/room.js");
	var pre = "/1/";

    app.get (pre + "update", room.updateDB);

    app.get (pre + "rooms/full", room.getFull);
	app.get (pre + "rooms/free", room.getFree);

    app.use("/", express.static("../front/"));
}


