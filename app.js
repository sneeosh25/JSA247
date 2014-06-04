var express = require('express');
var exphbs  = require('express3-handlebars');
var http = require('http');
var http_download = require('http-get');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var espn = require('espn');
var Twit = require('twit');
var	passport = require('passport')
var LinkedInStrategy = require('passport-linkedin').Strategy;
var util = require('util');
var LINKEDIN_API_KEY = '75kphyx1bjy90t';
var LINKEDIN_SECRET_KEY = 'QWYkeSPyYQsbbuUq';
var currentProfile;
var T = new Twit({
  consumer_key: 'PQJV3igtLyLYLzQRG3lzsqEtS', 
  consumer_secret: 'mIfx4uX5Pif7fZl13t77GzmAGtes4db3yXtmaSv6EEvjzKnAw0', 
  access_token: '318328164-si1OAfAFlywIuKE6FoT4vnn1Xna3lpSoz0DMZU7k', 
  access_token_secret: 'gddlhXiEkHVpHqpTfJ6rPMkgMMUApQ9lSyIzqcRnDE8s7'
});

var Flickr = require("flickrapi"), flickrOptions = { api_key: "19944eabc1790d16813ec79f66a26dbb", secret: "19944eabc1790d16813ec79f66a26dbb"};


//wrapping in a get
//tests of flickr - still need dynamic geo and location



function makePhotoURL(photoObj) {
  var farm_id = photoObj.farm;
  var server_id = photoObj.server;
  var id = photoObj.id;
  var secret = photoObj.secret;

  var url = 'http://farm' + farm_id + '.staticflickr.com/' + server_id + '/' + id + '_' + secret + '.jpg';

  return url;
}

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

app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

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
app.get('/loggedin', routes.loggedin);

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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the LinkedInStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and LinkedIn profile), and
//   invoke a callback with a user object.


passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: "http://" + process.env.base_url + "/auth/linkedin/callback",
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'three-past-positions', 'three-current-positions']
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
     // console.log(profile);
     //console.log(profile);
     currentProfile = profile
      return done(null, profile);
    });
  }
));


app.get("/linkedIn", function(req, res) {
	console.log(currentProfile);
	res.send(currentProfile._json);
});



// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in LinkedIn authentication will involve
//   redirecting the user to linkedin.com.  After authorization, LinkedIn will
//   redirect the user back to this application at /auth/linkedin/callback
app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/' }),
  function(req, res) {
  	console.log("redirect to yes");
    console.log(currentProfile);
    res.redirect('/loggedin');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}


app.get("/getWeatherPhoto/:place", function(req, rs) {
  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.search({
      tags: req.params.place, //need to make this specific to weather of the day
      //accuracy: 8,
      //group_id: '1463451@N25',
      sort: 'interestingness-desc'
    }, function(err, result) {
      // console.log(result);

      var firstResultPhoto = result.photos.photo[10];
      var downloadURL = makePhotoURL(firstResultPhoto);
      //console.log(downloadURL);
      rs.send(downloadURL);
    });
  });

});


app.get("/tweettrends/:lat/:long", function(req, res) {
  var lat = req.params.lat;
  var long = req.params.long;

  T.get('trends/closest', { lat: lat, long: long}, function(err, data, response) {
    if (err) {
      console.log(err);
    } else {
       var place = data[0];
       var WID = place.woeid;
       T.get('trends/place', { id: WID }, function (error, datr, resp) {
          console.log(datr);
          res.send(datr);
       });
    }
  });
});


//ny times calling api
app.get("/nytimes/:city/:industry", function(req, res) {
    var city = req.params.city; //spaces are still there
    var industry = req.params.industry
    callback = function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function () {
            //console.log(str);
            res.send(str);
        });
    }
    api_url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=business'+ '&fq=glocations:' + getNYTGLocation(city) + '&sort=newest&fl=headline,snippet&api-key=c7e1d240b0c7722f4be0df214bc71cd1:3:69108579';
    console.log("THE URL I AM CALLING IS: " + encodeURI(api_url));
    http.request(encodeURI(api_url), callback).end();
});

function getFormattedIndustry(industry) {
  return '(\"' + industry + '\")';
}

function getNYTGLocation(city) {
  if(city == "San Francisco") {
    return '(\"SAN FRANCISCO\")';
  }
  if(city == "New York") {
    return '(\"NEW YORK CITY\")';
  }
  if(city == "Los Angeles") {
    return '(\"LOS ANGELES\")';
  }
  if(city == "London") {
    return '(\"LONDON\")';
  }
  if(city == "Tokyo") {
    return '(\"TOKYO\")';
  } 
}

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


app.get("/weatherData/:lat/:long", function(req, res) {
	var lat = req.params.lat;
  var long = req.params.long;

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

	forecast.get([lat, long], function(err, weather) {
 	 if(err) console.dir(err);
 	 else {
 		 var weatherPack = {sum:weather.currently.summary, temp:weather.currently.temperature};
  		console.log(weatherPack);
  		res.send(weatherPack);
 		 }
		});
});
module.exports = app;
