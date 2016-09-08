var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/meows', function (req, res, next) {
  var meows = [
    'Hello I flipped over a cup.',
    'My owner just said hi to me. Yum.',
    'I ran around the house today and made a mess.',
    'Just climbing around.',
    'hello again'
  ];
  return res.send(meows);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
