var express = require('express');
var http = require('http');
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();

var router = express.Router();

var database;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    MongoClient.connect(databaseUrl, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;

        console.log('connected to DB : ' + databaseUrl);

        database = db.db('local');
    })
}

function inputData(database, name, callback) {
    console.log('inputData');

    var nameCollection = database.collection('name');

    nameCollection.insert([{"name" : name}], function(err) {
        if (err) {
            callback(err);
            return;
        }

        callback(null);
    });
}

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

router.get('/', function(req, res) {
    console.log('root');
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1> root </h1>');
    res.write("<a href='/memo.html'>start memo</a>");
})

router.route('/process/memo').post(function(req, res) {
    console.log('/process/memo');

    var paramName = req.body.name || req.query.name;
    var paramDate = req.body.date || req.query.date;
    var paramContext = req.body.context || req.query.context;
    console.log(paramName);
    console.log(paramDate.value);
    console.log(paramContext);

    if(database) {
        inputData(database, paramName, function(err) {
            if(err) {throw err;}
        })

        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1> memo </h1>');
        res.write('<label>success</label>');
        res.write("<a href='/memo.html>다시작성</a>");
        res.end();
    }
    else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>fail to connect DB</h2>');
        res.end();
    }
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), function() {
    console.log('start : ' + app.get('port'));

    connectDB();
});