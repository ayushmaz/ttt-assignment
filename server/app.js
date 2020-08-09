var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fetch = require("node-fetch");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/:id', (req, res, next) => {

  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');

  Promise.all([
    fetch('http://terriblytinytales.com/test.txt').then(x => x.text()),
  ]).then(([resp]) => {
    //console.log(sampleResp);
    var freq = {};
    var lines = resp.replace(/[.,\/#!$%\^&\*;?\t\d:{}=\-_`~()]/g, "").trim().split('\n');
    for (var i = 0; i < lines.length; i++) {
      var words = lines[i].split(" ");
      for (var j = 0; j < words.length; j++) {
        //console.log(words[j])
        if (words[j] == "") continue;

        if (freq[words[j]]) {
          freq[words[j]]++;
        } else {
          freq[words[j]] = 1;
        }
      }
    }


    var sortedKeys = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

    var sortedFreq = {}

    if (req.params.id < 1 || req.params.id > sortedKeys.length) {
      var err = new Error("Invalid number");
      err.status = 403;
      next(err);
    } else {
      for (var i = 0; i < req.params.id; i++) {
        sortedFreq[sortedKeys[i]] = freq[sortedKeys[i]];
      }
      //console.log(sortedFreq)

      res.setHeader('Content-Type', 'application/json')
      res.json(sortedFreq)
    }
  });

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
