var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');


module.exports = function (route) {

    // save a new user

    route.post('/createUser', function (req, res) {
        var user = new User();

        user.fullname = req.body.fullname;
        user.email = req.body.email;
        user.password = req.body.password;

        if (userValidation(user)) {
            user.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    var response = { 'status': 'success', 'message': 'User created Successfully.' };
                    res.send(response);
                }
            })
        } else {
            res.send('It appears you missed something.');
        }
    })

    //get one user

    route.get('/getUser', function (req, res) {
        var user = new User();

        user.email = req.body.email;
        user.password = req.body.password;

        user.findOne({ "email": req.body.email }, function (err, user) {
            if (err) {
                res.send(err);
            } else {

                res.send(user);
            }
        })
    })

    route.post('/authenticate', function (req, res, next) {

        if (req.body.email && req.body.password) {

            User.findOne({ 'email': req.body.email })
                .exec(function (err, user) {
                    if (err) {
                        var error = { 'status': 'failed', 'message': 'Some error occured.' }
                        return res.error(error);
                    }
                    else if (!user) {
                        var err = new error('User not found.');
                        err.status = '401';
                        return res.error(err);
                    }
                    bcrypt.compare(req.body.password, user.password, function (err, result) {
                        if (result === true) {
                            return res.send(user);
                        }
                        else {
                            var err = {'status' : 'failed', 'message' : 'Incorrect Password'};
                            return res.error(err);
                        }
                    })
                })
            }




            //     User.authenticate(req.body.email, req.body.password, function(error, user){
            //         if(error || !user){
            //             var err = new Error('Wrong email or password.');
            //             error.status = 401;
            //             return next(error);
            //         }
            //         else{
            //             req.session.userId = user._id;
            //             return res.send(user);
            //         }
            //     })
            // }
            // else{
            //     var err = new Error('All fields required.');
            //     err.status = 400;
            //     return next(err);
            // }
        })

    function userValidation(data) {
        if (data.fullname == null || data.fullname == '' || data.password == null || data.password == '' || data.email == null || data.email == '') {
            console.log('Validation Failed.');
            return false;
        } else {
            console.log('Validation Passed.');
            return true;
        }
    }

    return route;
}

