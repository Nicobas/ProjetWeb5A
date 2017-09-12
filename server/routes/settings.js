var path = require("path");

module.exports = function (router) {
    'use strict';

    router.route('/')
        .get(function (req, res, next) {
            //res.status(200).json({message: "Hello world !"})
            res.sendFile(path.join(__dirname + '/../../client/settings.html'));
        });
};


/**
 * IN CONSTRUCTION BELOW


app.post('/api/login',function(req,res){
    login(req.body.email, req.body.password, function(response){
        res.send(response);
        console.log(response);
    });
});

// function login (passedEmail, passedPassword, callback) {
//     var user_id;
//     var actualPassword;
//     var hashedPassword = md5(passedPassword);
//
//     //mongodb appelle ici
//
//
//      if(err){
//             console.log("err",err);
//             responseObject = {
//                 error: true,
//                 message: "Connection Error!",
//             };
//             callback(responseObject);
//         } else {
//             if(result.length != 0){
//                 actualPassword = result[0].password;
//                 user_id = result[0].id;
//
//                 /* Compare passwords */
//                 if (hashedPassword == actualPassword) {
//                     console.log("Passwords match");
//
//                     /* Get access token */
//                     getAccessToken(user_id,function(accessTokenResponse){
//                         if (accessTokenResponse["error"]){
//                             callback(accessTokenResponse);
//                         } else{
//                             sendbird_id = SENDBIRD_ID_PREFIX+user_id;
//                             responseObject = {
//                                 user_id: user_id,
//                                 email: passedEmail,
//                             };
//                             callback(responseObject);
//                         }
//                     });
//                 } else {
//                     console.log("Passwords don't match!");
//                     responseObject = {
//                         error: true,
//                         message: "Incorrect email/password", // Incorrect password
//                     };
//                     callback(responseObject);
//                 }
//             } else {
//                 console.log("Email doesn't exist");
//                 responseObject = {
//                     error: true,
//                     message: "Incorrect email/password", // Incorrect email
//                 };
//                 callback(responseObject);
//             }
//         }
// }

