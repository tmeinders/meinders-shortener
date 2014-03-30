var express = require('express');
var fs = require('fs');
var url = require('url');

if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(":")[1]);
} else {
	var redis = require("redis").createClient();
}

var app = express();
app.use(express.logger());

app.get('/shorten', function(request, response) {
  fs.readFile('./shorten.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });
});

app.get('/success', function(request, response) {
  var url_parts = url.parse(request.url, true);
  var content = '<a href="http://meinde.rs/' + url_parts.query['path'] + '">Success</a>';
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(content, 'utf-8');
});

app.get('/shortenaction', function(request, response, next) {
  var url_parts = url.parse(request.url, true);
  console.log('shortenaction...');
  redis.set('/' + url_parts.query['path'],url_parts.query['url'],redis.print);
  response.redirect('success?path=' + url_parts.query['path']);
  response.end();
});


app.get('*', function(request, response, next) {
  var path = url.parse(request.url).pathname; 
  console.log('path: ' + path);
  if (path != undefined)
  {
     redis.get(path, 
  	   function(err,reply){ 
         console.log('reply: ' + reply);
		 if (reply != null)
		 {
	       response.redirect(reply);
	       response.end();
           console.log('redirecting...');
		 }
		 else
		 {
           response.writeHead(500);
           response.end();
		 }
       }
     );
  }
  else
  {
    response.writeHead(500);
    response.end();
  }
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
