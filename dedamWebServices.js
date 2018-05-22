var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db.js');

var unittest = require('./unittest.js');

var app = express();
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));   
})

app.get('/rest/unittest', function(req, res) {
    unittest.UnitTest_CreateUser();
    res.statusCode=200;
    res.send('ok');
})

app.get('/rest/usuario', function(req, res) {
    var callback = function(err, users){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        users.forEach( function(user){
            if(user.group!=null)
                user.group = {  name: user.group, href: '/rest/grupo/' + user.group };
        })
        res.send(users);
    }
    db.getAllUsers(callback);
})

app.post('/rest/usuario', function(req, res) {
    var user = JSON.parse(JSON.stringify(req.body));

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 201;
        res.send(data);
    }

    db.createUser(user, callback);
})

app.get('/rest/usuario/:id', function(req, res){
    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }

        if(data.group!=null)
            data.group = {  name: data.group, href: '/rest/grupo/' + data.group };

        res.statusCode = 200;
        res.send(data);
    }
    db.getUserById(req.params.id, callback);
})

app.delete('/rest/usuario/:id', function(req, res){
    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 204;
        res.send();
    }
    db.deleteUser(req.params.id, callback);
})

app.put('/rest/usuario/:id/:prop', function(req, res) {
    //id and alias can't be changed
    var props=["name", "surname", "age", "phone", "group", "photo"];
    if (props.indexOf(req.params.prop)<0){
        res.statusCode=400;
        res.send("Invalid property: " + req.params.prop);
        return;
    }

    if(req.params.prop == "group")
    {
        //check if group exists...
        var callbackGroup = function(err, data){
            if(err){
                res.statusCode = 400;
                res.send(err.message);
                return;
            }

            var callback = function(err, data){
                if(err){
                    res.statusCode = 400;
                    res.send(err.message);
                    return;
                }
                res.statusCode = 204;
                res.send();
            }
            db.setUserProperty(req.params.id, req.params.prop, req.body.value, callback);
        }
        db.getGroupByName(req.body.value, callbackGroup);
    }
    else
    {
        var callback = function(err, data){
            if(err){
                res.statusCode = 400;
                res.send(err.message);
                return;
            }
            res.statusCode = 204;
            res.send();
        }
        db.setUserProperty(req.params.id, req.params.prop, req.body.value, callback);
    }
})

app.get('/rest/usuario/:id/:prop', function(req, res) {
    //id and alias can't be changed
    var props=["name", "surname", "age", "phone", "group", "photo"];
    if (props.indexOf(req.params.prop)<0){
        res.statusCode=400;
        res.send("Invalid property: " + req.params.prop);
        return;
    }

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        data.self = '/rest/usuario/' + req.params.id + '/' + req.params.prop;

        if(req.params.prop=="group")
            data = { name: data.group, href: data.self };

        res.statusCode = 200;
        res.send(data);
    }

    db.getUserProperty(req.params.id, req.params.prop, callback);
})

app.delete('/rest/usuario/:id/:prop', function(req, res) {
    //id and alias can't be changed
    var props=["name", "surname", "age", "phone", "group", "photo"];
    if (props.indexOf(req.params.prop)<0){
        res.statusCode=400;
        res.send("Invalid property: " + req.params.prop);
        return;
    }

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 204;
        res.send();
    }

    db.deleteUserProperty(req.params.id, req.params.prop, callback);
})

app.get('/rest/grupo', function(req, res) {
    var callback = function(err, users){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.send(users);
    }
    db.getAllGroups(callback);
})

app.post('/rest/grupo', function(req, res) {
    var group = JSON.parse(JSON.stringify(req.body));

    var callback = function(err, data){
        if(err){
            res.statusCode = 400;
            res.send(err.message);
            return;
        }
        res.statusCode = 201;
        res.send(data);
    }

    db.createGroup(group, callback);
})

var server = app.listen(3001, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})