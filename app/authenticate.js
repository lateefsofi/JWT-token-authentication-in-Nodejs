var express= require('express');
var apiRoutes = express.Router(); 
var User= require('./models/user');
var jwt= require('jsonwebtoken');
var app = express();
var config= require('../config');
var enCryptNCompare= require('./passwd-encryption-n-compare');


app.set('secretOrPrivateKey', config.secret);

// route to authenticate a user
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      enCryptNCompare.comparePassword(req.body.password, user.password, function(err, isPasswordMatched){
        if (!isPasswordMatched) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        else {

                  // create a token with given payload
                  const payload = {
                    role: user.role,
                    name: user.name
                  };
                  var token = jwt.sign(payload, app.get('secretOrPrivateKey'), { 
                   expiresIn: '1d' // expires in 1 day
                 });

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'login success!',
                  token: token
                });
              }   

            });
    }
  });
});
  module.exports=  apiRoutes;