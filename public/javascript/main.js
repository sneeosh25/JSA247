//Main.js


var apiKey = "44754112";
var sessionId = "1_MX40NDc1NDExMn5-TW9uIE1heSAwNSAyMjo0Njo1NiBQRFQgMjAxNH4wLjE3MjQ1MjU3flB-";
var subToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1lYWI3NDc2ZWY0NDhhMjQ0ODFmM2M1OGVmZDc3ZGUzMGUxMjAxNDNlOnJvbGU9c3Vic2NyaWJlciZzZXNzaW9uX2lkPTFfTVg0ME5EYzFOREV4TW41LVRXOXVJRTFoZVNBd05TQXlNam8wTmpvMU5pQlFSRlFnTWpBeE5INHdMakUzTWpRMU1qVTNmbEItJmNyZWF0ZV90aW1lPTEzOTkzNTUyMzMmbm9uY2U9MC43MzE0MDMxOTMyNTkxMzAyJmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var pubToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mMTA4NGFkNGQ2YWFiNjBiOGFmZDc1OTFlZmI5ZWQyNDhmNTQ0NDA2OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI0NiZub25jZT0wLjQ2MzAzOTY3MTM3NjQ0Mjc1JmV4cGlyZV90aW1lPTE0MDE5NDcyMTAmY29ubmVjdGlvbl9kYXRhPQ==";
var modToken = "T1==cGFydG5lcl9pZD00NDc1NDExMiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mYzQxNTBkM2RlYTFlN2Q1MGRhM2ZkYWRhYWM2MzgxNTczZTI5YzRkOnJvbGU9bW9kZXJhdG9yJnNlc3Npb25faWQ9MV9NWDQwTkRjMU5ERXhNbjUtVFc5dUlFMWhlU0F3TlNBeU1qbzBOam8xTmlCUVJGUWdNakF4Tkg0d0xqRTNNalExTWpVM2ZsQi0mY3JlYXRlX3RpbWU9MTM5OTM1NTI2OCZub25jZT0wLjM1NzMzNTkxNTAwOTkwOSZleHBpcmVfdGltZT0xNDAxOTQ3MjEwJmNvbm5lY3Rpb25fZGF0YT0=";


$(document).ready(function(){
  initialize();
  getTweets();
  getSports();
  getNYTimes();
  getWeather();
});

function getTweets() {
  $.get("/tweettrends", function (data) {
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
      trendElement.appendChild(a);
      trendList.appendChild(trendElement);
    });

    var trenddiv = document.getElementById('trenddiv');
    trenddiv.appendChild(trendList);
  });
}


function getNYTimes() {
  $.get("/nytimes", function (data) {
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

function getWeather() {
	$.get("/weatherData", function(data) {
		var weatherDiv = document.getElementById('weather');
		var weatherP = document.createElement('p');
		
		weatherDiv.innerHTML = "<b>Weather: </b>" + JSON.stringify(data.temp) + "F :" + JSON.stringify(data.sum);
	});
	
}

function initialize() {
  $("#start_button").click(initSession);
}


function initSession() {
  console.log("initializing session");

  var session = OT.initSession(apiKey, sessionId);

  var me = $("#me");

  session.on("streamCreated", function(event) {
    var props = {insertMode: "preppend", width: 605, height: 500};
    session.subscribe(event.stream, "you", props);
    $("#me").animate({
      left: "440px",
      top: "340px" 
    }, 400);

  });

  session.connect(pubToken, function(error) {
    $("#start").html("Waiting for a friend");
    $("#you").fadeIn();
    var props = {width: 150, height: 150};
    var publisher = OT.initPublisher("me", props);
    session.publish(publisher);
  });

}


