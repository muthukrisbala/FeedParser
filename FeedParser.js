var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

var req = request('https://www.youtube.com/feeds/videos.xml?channel_id=UCOpUWgNJq1kUlB3Z5KM7X-A');
var feedparser = new FeedParser();

req.on('error', function (error) {
  // handle any request errors
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/onlinetamilportal";

  while (item = stream.read()) {
    if(item.title.startsWith("Azhagu") || item.title.startsWith("Kalyanaparisu")){
      var title=item.title;
      title=title.replace(/ \| /g," ");
      title=title.replace(/ - /g," ");
      title=title.replace(/Vision Time/g,"");
      title=title.trim();

      var link=item.link;
      var startindex=link.indexOf("watch?v=");
      var videoid=link.substring(startindex+8,link.Length);
      var pubdate=item.pubdate;
      var date=item.date;
      console.log("Title: "+title);
      console.log("Link: "+link);
      console.log("Video ID: "+videoid);
      console.log("pubdate: "+pubdate);
      console.log("date: "+date);
console.log("Before Object construction");

          var postobject={};
          postobject.title=title;
          postobject.description=title;
          postobject.keywords=title;
          postobject.img="Test";
          postobject.content=videoid;
          postobject.posttype="video";
          postobject.publishedby="Admin";
          postobject.publishedon="2018-05-25T15:30:15.32";
          postobject.category="Tv Serial";
          console.log("Before Object print");
          console.log("Object: "+postobject);






          MongoClient.connect(url, function(err, MongoClient) {
            if (err) throw err;
              var db = MongoClient.db("onlinetamilportal");
              console.log("VVideoid: "+videoid);
              var regex = new RegExp(["^", videoid, "$"].join(""), "i");

              db.collection("post").find({"content":regex}).count( function(err, result) {
                if (err) throw err;
                  console.log("Result1: "+result);
                  if(result==0){

                    db.collection("post").insert(postobject,function(err, result) {
                      if (err) throw err;
                      console.log("Success");

                    });

                  }


                });

              });
    }
  }
});
