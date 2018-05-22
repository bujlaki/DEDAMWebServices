var bodyParser = require('body-parser');
var db = require('./db.js');

exports.UnitTest_CreateUser = function(){
    var user = {
        alias: "unittest",
        name: "unit test name",
        surname: "unit test surname"
    }

    console.log('STARTING UNITTEST: CreateUser');

    db.createUser(user, function(err, userdata){
        if(err){
            console.log(err);
            return;
        }

        console.log('USER CREATED:');
        console.log(JSON.stringify(userdata));

        db.deleteUser(userdata.id, function(err){
            if(err){
                console.log(err);
                return;
            }

            console.log('USER DELETED');
        });
    });
}