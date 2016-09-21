var express = require('express'),
        mongoClient = require('mongodb').MongoClient,
        ObjectId = require('mongodb').ObjectId,
        bodyParser = require('body-parser');
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

app.get('/meows', function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    meowsCollection.find().toArray(function (err, meows) {
      return res.json(meows);
    });
  });
});

app.post('/meows',function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    var newMeow = {
      text: req.body.newMeow
    };
    meowsCollection.insert(newMeow, {w: 1}, function(err, meows){
      console.log("Record added as "+ meows);
      return res.send();
    });
  });
});

app.put('/meows/remove',function (req, res, next) {
  db.collection('meows', function (err, meowsCollection) {
    var meowId = req.body.meow._id;
    meowsCollection.remove({_id: new ObjectId(meowId)}, {w: 1}, function(err){
      console.log("Record deleted as "+ meowId);
      return res.send();
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
