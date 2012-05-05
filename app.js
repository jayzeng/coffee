
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongodb = require('mongoose')
  ;

var Schema = mongodb.Schema;

mongodb.connect('mongodb://coffeedb:coffeedb@ds033217.mongolab.com:33217/coffeedb</password>');

var drinkers = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

var drinkerModel = mongodb.model('drinkers', drinkers);  

var shops = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true }
});

var shopsModel = mongodb.model('shops', shops);  
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// Routing 
// GET drinkers - populate all drinkers
app.get('/drinkers', function (req, res) {
  return drinkerModel.find(function(errors, drinkers) {
    if(errors) {
        console.log(errors);
    }else{
        return res.send(drinkers);
    }
  });
});

app.get('/shops', function (req, res) {
  return shopsModel.find(function(errors, shops) {
    if(errors) {
        console.log(errors);
    }else{
        return res.send(shops);
    }
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
