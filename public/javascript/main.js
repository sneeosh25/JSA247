//Main.js

var apiKey = "44754112";
var sessionId = "1_MX40NDc1NDExMn5-TW9uIE1heSAwNSAyMjo0Njo1NiBQRFQgMjAxNH4wLjE3MjQ1MjU3flB-";
var subToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1lYWI3NDc2ZWY0NDhhMjQ0ODFmM2M1OGVmZDc3ZGUzMGUxMjAxNDNlOnJvbGU9c3Vic2NyaWJlciZzZXNzaW9uX2lkPTFfTVg0ME5EYzFOREV4TW41LVRXOXVJRTFoZVNBd05TQXlNam8wTmpvMU5pQlFSRlFnTWpBeE5INHdMakUzTWpRMU1qVTNmbEItJmNyZWF0ZV90aW1lPTEzOTkzNTUyMzMmbm9uY2U9MC43MzE0MDMxOTMyNTkxMzAyJmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var pubToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mMTA4NGFkNGQ2YWFiNjBiOGFmZDc1OTFlZmI5ZWQyNDhmNTQ0NDA2OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI0NiZub25jZT0wLjQ2MzAzOTY3MTM3NjQ0Mjc1JmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var modToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mYzQxNTBkM2RlYTFlN2Q1MGRhM2ZkYWRhYWM2MzgxNTczZTI5YzRkOnJvbGU9bW9kZXJhdG9yJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI2OCZub25jZT0wLjM1NzMzNTkxNTAwOTkwOSZleHBpcmVfdGltZT0xNDAxOTQ3MjEwJmNvbm5lY3Rpb25fZGF0YT0=";

var fb_instance;
var fb_stream;

var me_city;
var me_full_name;
var me_id;

var you_city;
var you_full_name;

var first = true;

$(document).ready(function(){
  initializeTokBox();
});

function connect_to_firebase(){
  /* Include your Firebase link here!*/
  fb_instance = new Firebase("https://snapchat-for-dogs.firebaseio.com");
  fb_stream_id = 2023456;

  fb_stream = fb_instance.child(fb_stream_id);
  window.onbeforeunload = function() {
    fb_stream.remove();  
  };

  // only allow 0 and 1 pieces of data 
  // var num = fb_stream.numChildren();
  // if(!(num < 2)) {
  //   fb_stream.remove();
  // }

  fb_stream.on("child_added", function(snapshot) {
    obj = snapshot.val();
    console.log(obj);
    if(obj.id != me_id && obj.id != null) {
      you_city = obj.city;
      you_full_name = obj.full_name;
      addContext();
    }
  });
}

function initChat() {
  $("#start").fadeOut();
  $("#chat_info").css("margin-top", 40);
  $("#chat_info").fadeIn(); 
  //$("#join_chat_btn").click(joinChat);
}

function joinChat() {
  me_full_name = document.forms["centered_form"]["full_name"].value;
  me_city = document.forms["centered_form"]["select_city"].value;
  me_id = Math.random();

  $(".message").html("");
  $("#chat_info").fadeOut();
  $("#content").fadeIn();

  connect_to_firebase();

  fb_stream.push({id: me_id, full_name: me_full_name, city: me_city});
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
  var me = $("#me");

  session.on("streamCreated", function(event) {
    var props = {insertMode: "preppend", width: 605, height: 500};
    session.subscribe(event.stream, "you", props);
    $("#me").animate({
      left: "440px",
      top: "340px" 
    }, 400);
    console.log(session.data);
  });

  session.connect(pubToken, function(error) {
    // $("#start").html("Waiting for a friend");
    $("#you").fadeIn();
    var props = {width: 150, height: 150};
    var publisher = OT.initPublisher("me", props);
    session.publish(publisher);
  });
}

function addContext() {
  getWeatherBackground(encodeURI(you_city));
  // getTweets(getLat(you_city), getLong(you_city));
  getNYTimes(you_city);
  getWeather(getLat(you_city), getLong(you_city));
  // getSports();
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

function getWeatherBackground(place) {
  $.get("/getWeatherPhoto/" + place, function (data) {
    console.log(data);
    var section = document.getElementById('content');
    section.style.backgroundImage = 'url(' + data + ')';
  });
};

 
// function getTweets(lat, long) {
//   $.get("/tweettrends/" + lat + "/" + long, function (data) {
//     console.log(data);
//     console.log("got response back from server bitches");

//     data = data[0];
//     var trnds = data.trends;
//     console.log(trnds);

//     var trendList = document.createElement("ul");

//     trnds.forEach(function (entry) {
//       var name = entry.name;
//       var url = entry.url;

//       var trendElement = document.createElement("li");
//       var a = document.createElement("a");
//       a.textContent = name;
//       a.setAttribute('href', url);
//       a.setAttribute('target', "_blank");
//       trendElement.appendChild(a);
//       trendList.appendChild(trendElement);
//     });

//     var trenddiv = document.getElementById('trenddiv');
//     trenddiv.appendChild(trendList);
//   });
// }

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

    var nydiv = document.getElementById('nydiv');

    nydiv.appendChild(nyList);

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

function getWeather(lat, long) {
	$.get("/weatherData/" + lat + "/" + long, function(data) {
		var weatherDiv = document.getElementById('weather');
		var weatherheader = document.createElement('h4');

    weatherheader.innerHTML = "Their Local Weather: " + data.temp + " F | " + data.sum;
    weatherDiv.appendChild(weatherheader);
		
		//weatherDiv.innerHTML = "<b>Weather: </b>" + JSON.stringify(data.temp) + "F :" + JSON.stringify(data.sum);
	});
	
}

