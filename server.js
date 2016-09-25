var express = require('express'),
        mongoClient = require('mongodb').MongoClient,
        ObjectId = require('mongodb').ObjectId,
        bodyParser = require('body-parser'),
        bcrypt = require('bcryptjs');
var app = express();

var dbUrl = 'mongodb://localhost:27017/mittens',
        db = null;

mongoClient.connect(dbUrl, function (err, dbconn) {
  if (!err) {
    console.log('connected to Database');
    /*
    var adminDb = dbconn.admin();
    adminDb.listDatabases(function (err, dbs) {
      console.log(dbs.databases);
    });
    */
    db = dbconn;
  }
});

app.use(bodyParser.json());
app.use(express.static('public'));

//Get all meows from mittens DB
app.get('/meows', function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    meowsCollection.find().toArray(function (err, meows) {
      return res.json(meows);
    });
  });
});

//save a new Meow
app.post('/meows',function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    var newMeow = {
      text: req.body.newMeow
    };
    meowsCollection.insert(newMeow, {w: 1}, function(err, meows){
      console.log("Record added as "+ newMeow);
      return res.send();
    });
  });
});

//remove a meow
app.put('/meows/remove',function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    var meowId = req.body.meow._id;
    meowsCollection.remove({_id: new ObjectId(meowId)}, {w: 1}, function(err){
      console.log("Record deleted as "+ meowId);
      return res.send();
    });
  });
});

//save a new user
app.post('/users',function (req, res, next) {
  db.collection('users', function (err, usersCollection) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        var newUser = {
          username: req.body.username,
          password: hash
        };
        usersCollection.insert(newUser, {w: 1}, function(err){
          console.log("Record added as "+ hash);
          return res.send();
        });
      });
    });
  });
});

//simple login
app.put('/users/signin',function (req, res, next) {
  db.collection('users', function (err, usersCollection) {

    usersCollection.findOne({username: req.body.username}, function (err, user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          return res.send();
        } else {
          return res.status(400).send();
        }
      });
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        var newUser = {
          username: req.body.username,
          password: hash
        };
        usersCollection.insert(newUser, {w: 1}, function(err){
          console.log("Record added as "+ hash);
          return res.send();
        });
      });
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
