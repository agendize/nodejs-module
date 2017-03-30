var express = require('express');
	logger = require('winston');

var app = express();

var PORT = process.env.PORT || 5000;

app.engine('html', require('ejs').renderFile);

app.set('views', __dirname + '/frontend/views/views');

app.set('view engine', 'html');

app.use('/',require(__dirname+'/backend/routes'));

exports.server = app.listen(PORT, function() {
	logger.info("Server started and listening on port " + PORT);
});