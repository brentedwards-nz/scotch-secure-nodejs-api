var express = require('express');
var request = require('superagent');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));

var NON_INTERACTIVE_CLIENT_ID = 'V0IG7b6thMoc43Q3QRuxUtqIPPnrY17O'
var NON_INTERACTIVE_CLIENT_SECRET = 'OpaEYNMToOe4sfBpjYjHwWUP10WTrfjZlW2KrTPh1PseHnPPaCgMLKk8Eouu7B_e'

var authData = {
  client_id: NON_INTERACTIVE_CLIENT_ID,
  client_secret: NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: 'http://localhost:8080/'
}

// First, authenticate this client and get an access_token
// This could be cached
function getAccessToken(req, res, next){
  request
    .post('https://beonline.au.auth0.com/oauth/token')
    .send(authData)
    .end(function(err, res) {
      req.access_token = res.body.access_token
      next();
    })
}

app.get('/', function(req, res){
  res.render('index');
})

app.get('/movies', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/movies')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {

      if(err)
      {
        console.log("Error Occured:" + err);
      }
      else
      {
        console.log(data);
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('movies', { movies: movies} );
      }
      }
    })
})

app.get('/authors', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/reviewers')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var authors = data.body;
        res.render('authors', {authors : authors});
      }
    })
})

app.get('/publications', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/publications')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var publications = data.body;
        res.render('publications', {publications : publications});
      }
    })
})

app.get('/pending', getAccessToken, function(req, res){
  request
    .get('http://localhost:8080/pending')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if(data.status == 403){
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('pending', {movies : movies});
      }
    })
})

app.listen(3000);