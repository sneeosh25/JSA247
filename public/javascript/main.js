//Main.js

var apiKey = "44754112";
var sessionId = "1_MX40NDc1NDExMn5-TW9uIE1heSAwNSAyMjo0Njo1NiBQRFQgMjAxNH4wLjE3MjQ1MjU3flB-";
var subToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1lYWI3NDc2ZWY0NDhhMjQ0ODFmM2M1OGVmZDc3ZGUzMGUxMjAxNDNlOnJvbGU9c3Vic2NyaWJlciZzZXNzaW9uX2lkPTFfTVg0ME5EYzFOREV4TW41LVRXOXVJRTFoZVNBd05TQXlNam8wTmpvMU5pQlFSRlFnTWpBeE5INHdMakUzTWpRMU1qVTNmbEItJmNyZWF0ZV90aW1lPTEzOTkzNTUyMzMmbm9uY2U9MC43MzE0MDMxOTMyNTkxMzAyJmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var pubToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mMTA4NGFkNGQ2YWFiNjBiOGFmZDc1OTFlZmI5ZWQyNDhmNTQ0NDA2OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI0NiZub25jZT0wLjQ2MzAzOTY3MTM3NjQ0Mjc1JmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var modToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mYzQxNTBkM2RlYTFlN2Q1MGRhM2ZkYWRhYWM2MzgxNTczZTI5YzRkOnJvbGU9bW9kZXJhdG9yJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI2OCZub25jZT0wLjM1NzMzNTkxNTAwOTkwOSZleHBpcmVfdGltZT0xNDAxOTQ3MjEwJmNvbm5lY3Rpb25fZGF0YT0=";

var fb_instance;
var fb_stream;

var me = {id: -1, city: "", full_name: "", industry: ""}
var you = {id: -1, city: "", full_name: "", industry: ""};

var first = true;

$(document).ready(function(){
  initializeTokBox();
});

function toggleNews() {
  $("#news_content").toggle();
}

function toggleTwitter() {
  $("#twitter_content").toggle();
}

function connect_to_firebase(){
  /* Include your Firebase link here!*/
  fb_instance = new Firebase("https://snapchat-for-dogs.firebaseio.com");
  fb_stream_id = 2023456;

  fb_stream = fb_instance.child(fb_stream_id);
  window.onbeforeunload = function() {
    fb_stream.remove();  
  };

  fb_stream.on("child_added", function(snapshot) {
    obj = snapshot.val();
    console.log(obj);
    if(obj.id != me.id && obj.id != null) {
      you.city = obj.city;
      you.full_name = obj.full_name;
      you.industry = obj.industry;
      you.id = obj.id;
      addContext();
      stallForContext();
    }
  });
}

function initChat() {
  $("#start").hide();
  $("#subheader").hide();
  $("#chat_info").css("margin-top", 40);
  $("#chat_info").fadeIn(); 
  //$("#join_chat_btn").click(joinChat);
}

function joinChat() {
  me.full_name = document.forms["centered_form"]["full_name"].value;
  me.city = document.forms["centered_form"]["select_city"].value;
  me.industry = document.forms["centered_form"]["select_industry"].value;
  me.id = Math.random();

  $(".message").hide();
  $("#centered_form").hide();
  $("#waiting").fadeIn();

  stallForContext();
  connect_to_firebase();
  fb_stream.push({id: me.id, full_name: me.full_name, city: me.city, industry: me.industry});
}

function stallForContext() {
  if(you.id != -1 && me.id != -1) {
    $("#chat_info").hide();
    $("#content").fadeIn();
  }
}

// var posLat;
//   var posLong;
//   if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       posLat = position.coords.latitude;
//       posLong = position.coords.longitude;
//       fb_instance_stream.push(posLat);          
//       // console.log(posLat);
//       // console.log(posLong);
//     }, function() {
//       handleNoGeolocation(true);
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     handleNoGeolocation(false);
//   }

function initializeTokBox() { 
  $("#start_button").click(initChat);

  var session = OT.initSession(apiKey, sessionId);
  var me_div = $("#me");

  session.on("streamCreated", function(event) {
    var props = {insertMode: "preppend", width: 605, height: 500};
    session.subscribe(event.stream, "you", props);
    $("#me").css("left", 440);
    $("#me").css("top", 340);
    console.log(session.data);
  });

  session.connect(pubToken, function(error) {
    var props = {width: 150, height: 150};
    var publisher = OT.initPublisher("me", props);
    session.publish(publisher);
  });
}

function addContext() {
  getPartnerNameCityWeather(you.full_name, you.city);
  getTweets(getLat(you.city), getLong(you.city));
  getNYTimes(you.city);
  //getWeather(getLat(you.city), getLong(you.city));
  // getSports();
}

function getPartnerNameCityWeather(name, location) {
  var nameDiv = document.getElementById("partnerName");
  var header = document.createElement("h4");
  var headerString = name + " | " + location;
  $.get("/weatherData/" + getLat(location) + "/" + getLong(location), function(data) {
    headerString += " | " + data.temp + " F, " + data.sum;
    header.innerHTML = headerString;
    nameDiv.appendChild(header);   

    //now call the weather background change passing it the summary weather and place
    getWeatherBackground(data.sum, location);
  });
}

function getLat(city) {
  if(city == "San Francisco") {
    return 37.7833;
  }
  if(city == "New York") {
    return 40.7127;
  }
  if(city == "Los Angeles") {
    return 34.0500;
  }
  if(city == "London") {
    return 51.5072;
  }
  if(city == "Tokyo") {
    return 35.6895;
  }
}

function getLong(city) {
  if(city == "San Francisco") {
    return -122.4167;
  }
  if(city == "New York") {
    return -74.0059;
  }
  if(city == "Los Angeles") {
    return -118.2500;
  }
  if(city == "London") {
    return 0.1275;
  }
  if(city == "Tokyo") {
    return 139.6917;
  }
}

 
function getTweets(lat, long) {
  $.get("/tweettrends/" + lat + "/" + long, function (data) {
    console.log(data);
    console.log("got response back from server bitches");

    data = data[0];
    var trnds = data.trends;
    console.log(trnds);

    var trendList = document.createElement("ul");

    trnds.forEach(function (entry) {
      var name = entry.name;
      var url = entry.url;

      var trendElement = document.createElement("li");
      var a = document.createElement("a");
      a.textContent = name;
      a.setAttribute('href', url);
      a.setAttribute('target', "_blank");
      trendElement.appendChild(a);
      trendList.appendChild(trendElement);
    });

    var trenddiv = document.getElementById('twitter_content');
    trenddiv.appendChild(trendList);
    $("#twitter_header").click(toggleTwitter);
  });
}

function getNYTimes(city) {
  $.get("/nytimes/" + city, function (data) {
    console.log("Got news response back");
    
    var dataObj = JSON.parse(data);
    var docObjs = dataObj.response.docs;

    var nyList = document.createElement("dl");

    docObjs.forEach(function (entry) {
      var headline = entry.headline.main;
      var snippet = entry.snippet;

      var title = document.createElement("dt");
      title.innerHTML = headline;

      var description = document.createElement("dd");
      description.innerHTML = snippet;

      var br = document.createElement("br");

      nyList.appendChild(title);
      nyList.appendChild(description);
      nyList.appendChild(br);

    });

    var nydiv = document.getElementById('news_content');
    nydiv.appendChild(nyList);
    $("#news_header").click(toggleNews);
  });
}

function getSports() {
   $.get("/sportsData", function (data) {
      var newsFeed = data.feed;

      var list = document.createElement("ul");
      

      newsFeed.forEach(function (entry) {
        var headline = entry.headline;
        var description = entry.description;

        var listItem = document.createElement("li");
        listItem.innerHTML = headline + '\n' + description;

        list.appendChild(listItem);
      });

      var espdiv = document.getElementById('espnListContainer')

      espdiv.appendChild(list);
  });
}


//changed this to stop fetching from Flickr and just grab closest photo
//summary is the weather summary to check if there are clouds, place is just the city name
function getWeatherBackground(sum, place) {

  var offset = getUTCOffset(place);
  var ld = calcTime(offset);
  var timePeriod = getTimePeriod(ld);

  sum = sum.toLowerCase();
  place = place.toLowerCase();
  place = place.split(' ').join('_');

  var photoName = timePeriod;
  if (timePeriod == 'day' && sum.indexOf('cloudy') >  -1) {
    photoName += '_clouds';
  }
  photoName += '.jpg';

  //base url
  url = 'snapchat-for-dogs.herokuapp.com/images/weather/' + place + '/' + photoName;
  console.log('Trying to access ' + url);

  var section = document.getElementById('content');
  section.style.backgroundImage = 'url(' + url + ')';
};

//returns string of time of day for current time. time is a date object. 
//ex return data: 'night', 'day', 'evening', 'morning'
function getTimePeriod(time) {
  var hours = time.getHours();
  if (hours > 19 || hours < 6) {
    return 'night';
  }
  
  if (hours < 11) {
    return 'morning';
  }

  if (hours < 17) {
    return 'day';
  }

  if (hours <= 19) {
    return 'evening';
  }
}

// NYC: '-4', SF: '-7', TKY: '+9', LND: '+1'

//returns UTC offset in hours string depending on city name for select cities
function getUTCOffset(city) {
  if(city == "San Francisco") {
    return '-7';
  }
  if(city == "New York") {
    return '-4';
  }
  if(city == "Los Angeles") {
    return '-7';
  }
  if(city == "London") {
    return '+1';
  }
  if(city == "Tokyo") {
    return '+9';
  }
}

//returns a date object with the local time in the city of choice, given that city's UTC offset experssed 
//in hours. usage: calctime('+5.5') would give you the date object for current local time in Mumbai  

function calcTime(city_offset) {
  d = new Date();
  //convert to msec, add local time zone offset, get utc in msec
  utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  //create result date object for new city
  nd = new Date(utc + (3600000*city_offset));

  return nd;
}



