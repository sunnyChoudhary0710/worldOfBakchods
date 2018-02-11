/* Import the Mongoose software module */
var mongoose = require('mongoose');

/* Use encription for saving password */
var bcrypt = require('bcrypt-nodejs');

/* Create a Mongoose Schema object for generating
       document rules as to what structure MUST be
       expected when requesting/sending data to and from
       the MongoDB database collection */

var Schema = mongoose.Schema;

/* Define the schema rules (field names, types and rules) */

var UserSchema = new Schema({
    'fullname': { 'type': String, 'required': true, 'max': 50 },
    'email': { 'type': String, 'required': true, 'unique': true, 'lowercase': true },
    'password': { 'type': String, 'required': true },
    'blocked': { 'type': Boolean, 'default': false },
    'date': { 'type': Date, 'default': Date.now }
});

/* Encrypt password before saving */
UserSchema.pre('save', function (next) {
    var userEncription = this;
    bcrypt.hash(userEncription.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        } else {
            userEncription.password = hash;
            next();
        }
    });
});

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({'email' : email})
        .exec(function(err, user){
            if(err){
                return callback(err);
            }
            else if(!user){
                var err = new error('User not found.');
                err.status = '401';
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(err, result){
                if(result === true){
                    return callback(null, user);
                }
                else{
                    return callback();
                }
            })
        })
};


/* Export model for application usage */

module.exports = mongoose.model('User', UserSchema);