var express = require('express');
var exphbs  = require('express3-handlebars');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var espn = require('espn');
espn.setApiKey('ag2z9uxayb6g4qdt2jm6bzrs');

var nytimesapikey = 'c7e1d240b0c7722f4be0df214bc71cd1:3:69108579' ;

// Declare your route variables here.
var routes = require('./routes');
var app = express();

// enable sockiet io support
var server = http.createServer(app);
// var io = require('socket.io').listen(server);
// var chat = require('./routes/chat')(io);

// Heroku dynamically assigns your app a port, so you can't set the port to a fixed number. Heroku adds the port to the env, so you can pull it from there. http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
server.listen(process.env.PORT || 3000);
if (app.get('env') === 'development') {
    console.log("Now listening on port 3000");
}



// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Declare your routes here
app.get('/', routes.index);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//ny times calling api
app.get("/nytimes", function(req, res) {
    var lat = req.lat;
    var lon = req.lon;

//    var options = {
 //       host: 'http://api.nytimes.com/svc/search/v2/articlesearch',
  //      path: '/query.json?q=San+Francisco&sort=newest&fl=snippent&api-key=' + nytimesapikey
   // }

    callback = function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function () {
          //  console.log(str);
            res.send(str);
        });
    }

    http.request('http://api.nytimes.com/svc/search/v1/article?format=json&query=San+Francisco&rank=newest&api-key=c7e1d240b0c7722f4be0df214bc71cd1:3:69108579', callback).end();
});



//espn calling api
app.get("/sportsData", function(req, res) {
    espn.now(function (err, json) {
        if (err) {
            console.error(err);
            return;
        }
      //  console.log(json);
        res.send(json);
    });
});


var Forecast = require('forecast');

// Initialize


app.get("/weatherData", function(req, res) {
	
	var forecast = new Forecast({
  	service: 'forecast.io',
  	key: '1049445d8e5fb59c76899f0c231b67c6',
 	 units: 'F', // Only the first letter is parsed
  	cache: true,      // Cache API requests?
  	ttl: {           // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
      minutes: 27,
      seconds: 45
    }
	});
// Retrieve weather information from coordinates (Sydney, Australia)
	forecast.get([-33.8683, 151.2086], function(err, weather) {
 	 if(err) console.dir(err);
 	 else {
 		 var weatherPack = {sum:weather.currently.summary, temp:weather.currently.temperature};
  		console.log(weatherPack);
  		res.send(weatherPack);
 		 }
		});
});
module.exports = app;
