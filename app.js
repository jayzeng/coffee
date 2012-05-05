
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

// GET shops - fetch all Shops
app.get('/shops', function (req, res) {
  return shopsModel.find(function(errors, shops) {
    if(errors) {
        console.log(errors);
    }else{
        return res.send(shops);
    }
  });
});

//READ by ID - fetch a shop by ID
app.get('/shops/:id', function (req, res) {
  return shopsModel.findById(req.params.id, function ( err, shop) {
  if(!err) {
    return res.send(shop);
  } else {
    return console.log(err);
  }
  });
});

//POST shops - add a shop
// To run use  curl -X POST -d "name=val1&location=val2" http://localhost:3000/shops/add
app.post('/shops/add', function (req, res)  {
  var shop;
  console.log("POST: ");
  console.log(req.body);
  shop = new shopsModel ({
    name: req.body.name,
    location: req.body.location,
  });
  shop.save(function (err) {
    if(!err) {
      return console.log("created a new shop");
    } else {
      return console.log(err);
    }
  });
  return res.send(shop);
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
