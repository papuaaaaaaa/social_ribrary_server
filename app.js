var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
var BSON = mongodb.BSONPure;
var db, users, wanted_books, provided_books;

app.use(express.static('front'));
app.use(bodyParser.json());

mongodb.MongoClient.connect("mongodb://localhost:3333?safe=true", function(err, database) {
    db = database;
    users = db.collection("users");
    wanted_books = db.collection("wanted_books");
    provided_books = db.collection("provided_books");
    app.listen(8080);
});

// 一覧取得
app.get("/api/users", function(req, res) {
    users.find().toArray(function(err, items) {
        res.send(items);
    });
});

app.get("/api/wanted_books", function(req, res) {
    wanted_books.find().toArray(function(err, items) {
        res.send(items);
    });
});

app.get("/api/provided_books", function(req, res) {
    provided_books.find().toArray(function(err, items) {
        res.send(items);
    });
});

// 個人取得
app.get("/api/users/:_id", function(req, res) {
    users.findOne({_id: new BSON.ObjectID(req.params._id)}, function(err, item) {
        res.send(item);
    });
});

// 追加
app.post("/api/users", function(req, res) {
    var user = req.body;
    users.insert(user, function() {
        res.send("insert");
    });
});

app.post("/api/wanted_books", function(req, res) {
    var wanted_book = req.body;
    wanted_books.insert(wanted_book, function() {
        res.send("insert");
    });
});

app.post("/api/provided_books", function(req, res) {
    var provided_book = req.body;
    provided_books.insert(provided_book, function() {
        res.send("insert");
    });
});

// 更新
app.post("/api/users/:_id", function(req, res) {
    var user = req.body;
    delete user._id;
    users.update({_id: new BSON.ObjectID(req.params._id)}, user, function() {
        res.send("update");
    });
});

// 削除
app.delete("/api/users/:_id", function(req, res) {
    users.remove({_id: new BSON.ObjectID(req.params._id)}, function() {
        res.send("delete");
    });
});