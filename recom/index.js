
/**
 * Module dependencies.
 */

var express = require('express')
  , join = require('path').join
  , fs = require('fs');

var app = express();
var lessMiddleware = require('less-middleware');


// deprecated express methods
// app.use(express.favicon());
// app.use(express.logger('dev'));

app.set('views', __dirname);
app.set('view engine', 'jade');
app.enable('strict routing');

app.use(lessMiddleware(__dirname + '/recom/public'));


var recom = fs.readdirSync(__dirname).filter(function(file){
  return fs.statSync(__dirname + '/' + file).isDirectory();
});

// routes

/**
 * GET page.js
 */

app.get('/page.js', function(req, res){
  res.sendFile(join(__dirname, '..', 'page.js'));
});

/**
 * GET test libraries.
 */

app.get(/^\/(mocha|chai)\.(css|js)$/i, function(req, res){
  res.sendFile(join(__dirname, '../test/', req.params.join('.')));
});

/**
 * GET list of recom.
 */

app.get('/', function(req, res){
  res.redirect('/l');
});

/**
 * GET /:recom -> /:recom/
 */

app.get('/:recom', function(req, res){
  res.redirect('/' + req.params.recom + '/');
});

/**
 * GET /:recom/* as a file if it exists.
 */

app.get('/:recom/:file(*)', function(req, res, next){
  var file = req.params.file;
  if (!file) return next();
  var name = req.params.recom;
  var path = join(__dirname, name, file);
  fs.stat(path, function(err, stat){
    if (err) return next();
    res.sendFile(path);
  });
});

/**
 * GET /:recom/* as index.html
 */

app.get('/:recom/*', function(req, res){
  var name = req.params.recom;
  res.sendFile(join(__dirname, name, 'index.html'));
});

app.listen(5000);
console.log('client server listening on port 5000');
