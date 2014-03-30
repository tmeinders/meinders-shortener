var express = require('express');
var fs = require('fs');


//var redis = require("redis-url").connect(process.env.MYREDIS_URL);

var app = express();

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

app.get('*', function(request, response, next) {
  
  response.redirect(302,'http://www.meinders.com/test2.html');
  response.end();
  console.log('redirecting...');
    next();
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
