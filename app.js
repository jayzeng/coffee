
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


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
