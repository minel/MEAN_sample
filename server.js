var express = require('express'),
        mongoClient = require('mongodb').MongoClient,
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
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
