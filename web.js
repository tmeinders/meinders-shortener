var express = require('express');
var fs = require('fs');


var redis = require("redis-url").connect(process.env.MYREDIS_URL);

var app = express();

app.get('*', function(request, response, next) {
  
  console.log('* is executing');
  if (request.headers.host === 'www.meinde.rs')
  {
    response.redirect(302,'http://www.meinders.com/test2.html');
    response.end();
    console.log('redirecting...');
  }
  else
  {
    next();
  }
});

app.get('/', function(request, response) {
  console.log('host: ' + request.headers.host);
  console.log('/ is executing');
  fs.readFile('./index.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });


  //response.send('Hello World2!');
});


app.get('/test2.html', function(request, response) {
  response.send('you are using the shortener 2');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
