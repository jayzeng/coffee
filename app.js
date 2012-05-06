
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongodb = require('mongoose')
  ;

var Schema = mongodb.Schema;

mongodb.connect('mongodb://coffeedb:coffeedb@ds033217.mongolab.com:33217/coffeedb');

var drinkers = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

var shops = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    amount: { type:Number, required:false }
});

var drinkerModel = mongodb.model('drinkers', drinkers);  
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
  setJsonHeader(res);

  return drinkerModel.find(function(errors, drinkers) {
      parseCallback(errors, shop, res);
  });
});


app.put('/drinkers/:id', function (req, res){
  return drinkerModel.findById(req.params.id, function (err, drinker) {
    drinker.firstName = req.body.firstName;
    drinker.lastName = req.body.lastName;

    return drinker.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(drinker);
    });
  });
});

function setJsonHeader(res) {
  res.header('Content-Length', 'application/json');
}

function parseCallback(errors, obj, res) {
    if(errors) {
        console.log(errors);
    }

    return res.send(obj);
}


// GET shops - fetch all Shops
app.get('/shops', function (req, res) {
  setJsonHeader(res);

  return shopsModel.find(function(errors, shops) {
      parseCallback(errors, shops, res);
  });
});

//READ by ID - fetch a shop by ID
app.get('/shops/:id', function (req, res) {
  setJsonHeader(res);

  return shopsModel.findById(req.params.id, function ( err, shop) {
      parseCallback(errors, shop, res);
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
    amount:req.body.amount,
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
