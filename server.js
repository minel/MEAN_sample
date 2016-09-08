var express = require('express'),
        bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));


var meows = [
  'Hello I flipped over a cup.',
  'My owner just said hi to me. Yum.',
  'I ran around the house today and made a mess.',
  'Just climbing around.',
  'hello again there'
];

app.get('/meows', function (req, res, next) {
  return res.send(meows);
});

app.post('/meows',function (req, res, next) {
  meows.push(req.body.newMeow);
  res.send();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
