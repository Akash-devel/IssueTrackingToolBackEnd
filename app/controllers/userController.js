const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('./../libs/checkLib');
const passwordLib = require('./../libs/generatePassword');
const token = require('./../libs/tokenLib');
const validateInput = require('./../libs/paramsValidationLib');
const sgMail = require('@sendgrid/mail');

/* Models */
const UserModel = require('./../models/User');
const AuthModel = require('./../models/Auth');

let signUpFunction = (req, res) => {

    console.log(req.body);
    let validateUserInput = () => {

        return new Promise((resolve, reject) => {

            if (req.body.email) {

                if (!validateInput.Email(req.body.email)) {

                    let apiResponse = response.generate(true, 'Email does not meet the requirements', 400, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(req.body.password)) {

                    let apiResponse = response.generate(true, '"Password" parameter is missing', 400, null)
                    reject(apiResponse);
                }
                else {

                    resolve(req)
                }
            }
            else {

                logger.error('Email Field Missing During User Creation', 'userController: createUser()', 5);
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null);
                reject(apiResponse);
            }
        })
    } // end Validate User Input

    let createUser = () => {

        return new Promise((resolve, reject) => {

            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {

                    if (err) {

                        logger.error(err.message, 'userController: createUser', 10);
                        let apiResponse = response.generate(true, 'Failed to Create User', 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(retrievedUserDetails)) {

                        let newUser = new UserModel({

                            userId: shortid.generate(),
                            fullName: req.body.fullName,
                            email: req.body.email.toLowerCase(),
                            password: passwordLib.hashPassword(req.body.password),
                            createdOn: time.now()
                        })

                        newUser.save((err, newUser) => {

                            if (err) {

                                console.log(err);
                                logger.error(err.message, 'userController: createUser', 10);
                                let apiResponse = response.generate(true, 'Failed to Create new User', 500, null);
                                reject(apiResponse);
                            }
                            else {

                                let newUserObj = newUser.toObject();
                                resolve(newUserObj);
                            }
                        })
                    }
                    else {

                        logger.error('User Cannot Be Created. User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With This Email', 403, null)
                        reject(apiResponse);
                    }
                })
        })
    } // end Create User

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {

            delete resolve.password 
            let apiResponse = response.generate(false, 'User created', 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log('ERROR HANDLER OF signup CALLED');
            res.status(err.status);
            res.send(err);
        })
} // end start user sign up function

// start of login function
let loginFunction = (req, res) => {

    let findUser = () => {

        console.log("findUser");
        return new Promise((resolve, reject) => {

            if (req.body.email) {

                console.log("req body email is there");
                console.log(req.body);

                UserModel.findOne({ email: req.body.email }, (err, userDetails/*Response object*/) => {

                    if (err) {

                        console.log(err);
                        logger.error('Failed to retrieve User Data', 'userController: findUser()', 10);
                        let apiResponse = response.generate(true, 'Failed to Find User Details', 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {

                        // For Google or Fb sign in
                        if (req.body.boolSocialSignIn === 'true') {

                            let newUser = new UserModel({

                                userId: shortid.generate(),
                                fullName: req.body.fullName,
                                email: req.body.email.toLowerCase(),
                                password: null,
                                createdOn: time.now()
                            })

                            // Save the Social logged in user
                            newUser.save((err, newUser) => {

                                if (err) {

                                    console.log(err);
                                    logger.error(err.message, 'userController: createUser', 10);
                                    let apiResponse = response.generate(true, 'Failed to Create new User', 500, null);
                                    reject(apiResponse);
                                }
                                else {

                                    let newUserObj = newUser.toObject();
                                    resolve(newUserObj);
                                }
                            })

                        } else {
                            // Email not found
                            logger.error('No User Found with this Email', 'userController: findUser()', 7);
                            let apiResponse = response.generate(true, 'NO Email Found', 403, null);
                            reject(apiResponse);
                        }
                    }
                    else {
                        // Email Found
                        logger.info('User Found', 'userController: findUser()', 10);
                        resolve(userDetails);
                    }
                })
            }
            else {

                let apiResponse = response.generate(true, '"Email" parameter is missing', 400, null);
                reject(apiResponse);
            }
        })
    } // end findUser    

    let validatePassword = (retrievedUserDetails) => {

        console.log("validate Password");
        return new Promise((resolve, reject) => {

            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {

                if (err) {

                    console.log(err);
                    logger.error(err.message, 'userController: validatePassword()', 10);
                    let apiResponse = response.generate(true, 'Login Failed', 500, null);
                    reject(apiResponse);
                }
                else if (isMatch) {

                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password;
                    delete retrievedUserDetailsObj._id;
                    delete retrievedUserDetailsObj.__v;
                    delete retrievedUserDetailsObj.createdOn;
                    delete retrievedUserDetailsObj.modifiedOn;
                    resolve(retrievedUserDetailsObj);
                }
                else {

                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 401, null)
                    reject(apiResponse);
                }
            })
        })
    }
    // end validatePassword

    let generateToken = (userDetails) => {

        console.log("generate Token");
        return new Promise((resolve, reject) => {

            token.generateToken(userDetails, (err, tokenDetails) => {

                if (err) {

                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }
                else {

                    tokenDetails.userId = userDetails.userId; // For sending some data
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            })
        })
    }
    //end generateToken

    let saveToken = (tokenDetails) => {

        console.log("Save token");
        if (tokenDetails !== null) {
            return new Promise((resolve, reject) => {

                AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {

                    if (err) {

                        console.log(err);
                        logger.error(err.message, 'userController: saveToken', 10);
                        let apiResponse = response.generate(true, 'Failed to generate token', 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(retrievedTokenDetails)) {

                        // User logged in for the first time then ->
                        let newAuthToken = new AuthModel({

                            userId: tokenDetails.userId,
                            authToken: tokenDetails.token,
                            tokenSecret: tokenDetails.tokenSecret,
                            tokenGenerationTime: time.now()
                        })

                        newAuthToken.save((err, newTokenDetails) => {

                            if (err) {

                                console.log(err)
                                logger.error(err.message, 'userController: saveToken', 10)
                                let apiResponse = response.generate(true, 'Failed to Generate Token', 500, null)
                                reject(apiResponse)
                            }
                            else {

                                let responseBody = {

                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody);
                            }
                        })
                    }
                    else {

                        retrievedTokenDetails.authToken = tokenDetails.token;
                        retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                        retrievedTokenDetails.tokenGenerationTime = time.now();
                        retrievedTokenDetails.save((err, newTokenDetails) => {

                            if (err) {

                                console.log(err);
                                logger.error(err.message, 'userController: saveToken', 10)
                                let apiResponse = response.generate(true, 'Failed to generate token', 500, null)
                                reject(apiResponse);
                            }
                            else {

                                let responseBody = {

                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody);
                            }
                        })
                    }
                })
            })
        }
    } //end Save Token

    if (req.body.boolSocialSignIn === 'true') {

        findUser(req, res)
            .then(generateToken)
            .then(saveToken)
            .then((resolve) => {

                let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
                res.status(200)
                res.send(apiResponse)
            })
            .catch((err) => {

                console.log("errorhandler");
                console.log(err);
                res.status(err.status)
                res.send(err)
            })
    } else {

        findUser(req, res)
            .then(validatePassword)
            .then(generateToken)
            .then(saveToken)
            .then((resolve) => {

                let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
                res.status(200);
                res.send(apiResponse)
            })
            .catch((err) => {

                console.log("ERROR HANDLER OF login CALLED");
                console.log(err);
                res.status(err.status)
                res.send(err)
            })
    }

}
// end of login function

let forgotPwd = (req, res) => {

    let findUser = () => {

        console.log("findUser");
        return new Promise((resolve, reject) => {

            if (req.body.email) {

                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {

                    if (err) {

                        console.log(err);
                        logger.error('Failed to retrieve User Data', 'userController: findUser()', 10);
                        let apiResponse = response.generate(true, 'Failed to Find User Details', 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(userDetails)) {

                        logger.error('No User Found', 'userController: findUser()', 7);
                        let apiResponse = response.generate(true, 'No email found for this user', 403, null);
                        reject(apiResponse);
                    }
                    else {

                        logger.info('User Found', 'userController: findUser()', 10);
                        resolve(userDetails);
                    }
                })
            }
            else {

                let apiResponse = response.generate(true, '"Email" parameter is missing', 400, null);
                reject(apiResponse);
            }
        })
    }// end findUser


    let result = (userDetails) => {

        "use strict";
       
        function generate_random_string(string_length) {
            let random_string = '';
            let random_ascii;
            let ascii_low = 65;
            let ascii_high = 90
            for (let i = 0; i < string_length; i++) {
                random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
                random_string += String.fromCharCode(random_ascii)
            }
            return random_string
        }

        function generate_random_number() {
            let num_low = 1;
            let num_high = 9;
            return Math.floor((Math.random() * (num_high - num_low)) + num_low);
        }

        function generate() {
            return generate_random_string(3) + generate_random_number();
        }

        const token = generate();

        UserModel.updateOne({ email: userDetails.email }, { $set: { resetPasswordToken: token } }, function (err, res) {
        });

        sgMail.setApiKey('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');
        const mailOptions = {
            from: 'akashjagatdal@gmail.com', // sender address
            to: [userDetails.email], // list of receivers
            subject: 'IssueTrackingTool Reset Paswword', 
            html: '<b>Password Reset</b>' + '<br>' +
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br>' +
                'Please click on the following link, or paste this into your browser to complete the process:<br>' +
                'http://localhost:4200/change-password/' + token + '<br>' +
                'If you did not request this, please ignore this email and your password will remain unchanged.'
        };

        return new Promise((resolve, reject) => {
            sgMail.send(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    logger.error(err.message, 'userController: ForgotPassword', 10);
                    let apiResponse = response.generate(true, "Error in sending the link", 500, null);

                    reject(apiResponse);
                }
                else {
                    //console.log(info);
                    logger.info('Link sent to the mail', 'userController: ForgotPassword', 10);
                    resolve(info);
                }
            });
        });
    } // end result

    findUser(req, res)
        .then(result)
        .then((resolve) => {

            logger.info('Link sent successfully', 'userController: ForgotPassword', 10);
            let apiResponse = response.generate(false, "Password reset link sent", 200, resolve);
            res.send(apiResponse);
        })
        .catch((err) => {
           
            console.log('ERROR HANDLER OF forgotPassword CALLED');
            res.status(err.status);
            res.send(err);
        });
} // end forgot password function

let changePassword = (req, res) => {

    if (req.params.tokenId) {

        // Match if the token in the route same as that of stored token for that particular user
        UserModel.findOne({ resetPasswordToken: req.params.tokenId }, (err, incommingDetails) => {

            if (err) {

                logger.error(err.message, 'userController: ChangePassword', 10);
                let apiResponse = response.generate(true, 'Something went wrong', 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(incommingDetails)) {

                logger.error('NOT a valid token', 'userController: ChangePassword', 7);
                let apiResponse = response.generate(true, 'Invalid reset token', 403, null);
                res.send(apiResponse);
            }
            else {
                UserModel.findOne({ email: incommingDetails.email }, (error, emailDetails) => {

                    if (error) {

                        logger.error(error.message, 'userController: ChangePassword', 10);
                        let apiResponse = response.generate(true, 'Something went wrong', 500, null);
                        res.send(apiResponse);
                    }
                    else {

                        UserModel.updateOne({ email: emailDetails.email },
                            { $set: { password: passwordLib.hashPassword(req.body.newPassword) } },
                            function (err, details) {
                                if (err) {

                                    logger.error(err.message, 'userController: ChangePassword', 10);
                                    let apiResponse = response.generate(true, 'Something went wrong', 500, null);
                                    res.send(apiResponse);
                                }
                                else {

                                    logger.info('Password Changed Successfully', 'userController: ChangePassword', 10);
                                    let apiResponse = response.generate(false, 'Password Changed Successfully', 200, details);
                                    res.send(apiResponse);
                                }
                            });
                    }
                });
            }
        });
    } else {

        console.log('No Reset Token received');
    }
} // end changePassword function

let logOut = (req, res) => {

    AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {

        if (err) {

            console.log(err);
            logger.error(err.message, 'userController: logout()', 10);
            let apiResponse = response.generate(true, `Error occurred: ${err.message}`, 500, null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {

            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 403, null);
            res.send(apiResponse);
        }
        else {

            let apiResponse = response.generate(false, 'Successfully logged out', 200, null);
            res.send(apiResponse);
        }
    })
} // end logOut function

module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    forgotPwd: forgotPwd,
    changePassword: changePassword,
    logOut: logOut
}