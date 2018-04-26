var mysql = require('mysql');

var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '60Di91Ok62As',
    database: 'DEDAMDB'
});

exports.getAllUsers = function(callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }
        connection.query('SELECT * FROM users', function(err, results, fields){
            if (err) {
                connection.release();
                console.log(err);
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    })
}

exports.getUserByAlias = function(alias, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(error, null);
            return;
        }

        connection.query('SELECT * FROM users WHERE alias= ?', [alias], function(err, results, fields){
            connection.release();

            if (err) {
                console.log(err);
                callback(error, null);
                return;
            }

            if(results.length==0) {
                callback(new Error('User not found'), null);
                return;
            }

            callback(null, results[0]);
        });
    })
}

exports.getUserById = function(id, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('SELECT * FROM users WHERE id= ?', [id], function(err, results, fields){
            connection.release();

            if (err) {
                console.log(err);
                callback(err, null);
                return;
            }

            if(results.length==0) {
                 callback(new Error('User not found'), null);
                 return;
            }

            callback(null, results[0]);
        });
    })
}

exports.createUser = function(user, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('INSERT INTO users SET ?', user, function(err, results, fields){
            if (err) {
                connection.release();
                console.log(err);
                callback(err, null);
                return;
            }

            connection.query('UPDATE users SET self = ? WHERE id = ?', ['/rest/usuario/' + results.insertId, results.insertId], function(err, results, fields){
                if (err) {
                    connection.release();
                    console.log(err);
                    callback(err, null);
                    return;
                }

                connection.query('SELECT * FROM users WHERE alias= ?', [user.alias], function(err, results, fields){
                    connection.release();
                    if (err){
                        console.log(err);
                        callback(err, null);
                        return;
                    }
                    callback(null, results[0]);
                });
            });
        });
    });
}

exports.deleteUser = function(id, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('DELETE FROM users WHERE id= ?', [id], function(err, results, fields){
            connection.release();
            if (err){
                console.log(err);
                callback(err, null);
                return;
            }
            callback(null, null);
        });
    });
}

exports.setUserProperty = function(id, prop, value, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('UPDATE users SET `' + prop + '`= ? WHERE id = ?', [value, id], function(err, results, fields){
            connection.release();
            if (err){
                console.log(err);
                callback(err, null);
                return;
            }
            callback(null, null);
        });
    });
}

exports.deleteUserProperty = function(id, prop, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('UPDATE users SET ' + prop + '= "" WHERE id= ?', [id], function(err, results, fields){
            connection.release();
            if (err){
                console.log(err);
                callback(err, { userid: id });
                return;
            }
            callback(null, null);
        });
    });
}

exports.getUserProperty = function(id, prop, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('SELECT `' + prop + '` FROM users WHERE id= ?', id, function(err, results, fields){
            connection.release();
            if (err){
                console.log(err);
                callback(err, { userid: id });
                return;
            }
            callback(null, results[0]);
        });
    });
}

exports.getAllGroups = function(callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }
        connection.query('SELECT * FROM groups', function(err, results, fields){
            if (err) {
                connection.release();
                console.log(err);
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    })
}

exports.getGroupByName = function(groupName, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(error, null);
            return;
        }

        connection.query('SELECT * FROM groups WHERE name= ?', [groupName], function(err, results, fields){
            connection.release();
            if (err) {
                console.log(err);
                callback(error, null);
                return;
            }

            if(results.length==0) {
                callback(new Error('Group not found'), null);
                return;
            }

            callback(null, results[0]);
        });
    })
}

exports.createGroup = function(group, callback){
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            callback(err, null);
            return;
        }

        connection.query('INSERT INTO groups SET ?', group, function(err, results, fields){
            if (err) {
                connection.release();
                console.log(err);
                callback(err, null);
                return;
            }

            connection.query('UPDATE groups SET self = ? WHERE name = ?', ['/rest/grupo/' + group.name, group.name], function(err, results, fields){
                if (err) {
                    connection.release();
                    console.log(err);
                    callback(err, null);
                    return;
                }

                connection.query('SELECT * FROM groups WHERE name= ?', [group.name], function(err, results, fields){
                    connection.release();
                    if (err){
                        console.log(err);
                        callback(err, null);
                        return;
                    }
                    callback(null, results[0]);
                });
            });
        });
    });
}