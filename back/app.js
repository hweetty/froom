//Require main modules
var express = require('express'),
	mongoose = require('mongoose'),
	fileSystem = require('fs'),
	app = express();

//Load configuration file
var config = JSON.parse(fileSystem.readFileSync(__dirname + '/config.json'));

//Connect to database
if (!config.mongodb.username) {
	mongoose.connect('mongodb://localhost/' + config.mongodb.database);
}
else {
	mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.domain + '/' + config.mongodb.database);
}

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Setup express
app.configure(function() {
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	  app.use(express.cookieParser());
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		next();
	});
	app.use(app.router);
});

//Load routes
require('./routes.js')(app);

//Start server
var server = app.listen(3059);

console.log('Node/Express server started on ' + config.environment + ' server!');