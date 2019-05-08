const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const request = require('request')

const logger = require('./../libs/loggerLib');
const responseLib = require('./../libs/responseLib');
const token = require('./../libs/tokenLib');
const check = require('./../libs/checkLib');

const Auth = require('./../models/Auth');

let isAuthorized = (req, res, next) => {
    console.log(`------------ inside isAuthorized function-----------------`)

    if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {

        Auth.findOne({ authToken: req.header('authToken') || req.params.authToken || req.query.authToken || req.body.authToken },
            (err, authDetails) => {

                if (err) {

                    logger.error(err.message, 'Authorization-Middleware', 10)
                    let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
                    res.send(apiResponse)
                }
                else if (check.isEmpty(authDetails)) {

                    logger.error('No AuthorizationKey Is Present', 'AuthorizationMiddleware', 10)
                    let apiResponse = responseLib.generate(true, 'Invalid Or Expired AuthorizationKey', 511, null)
                    res.status(apiResponse.status);
                    res.send(apiResponse)
                }
                else {

                    token.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err, decoded) => {

                        if (err) {

                            logger.error(err.message, 'Authorization Middleware', 10)
                            let apiResponse = responseLib.generate(true, 'Failed To Authorized', 511, null)
                            res.status(apiResponse.status);
                            res.send(apiResponse)
                        }
                        else {

                            req.user = { userId: decoded.data.userId }
                            next();
                        }
                    })// end Verify Token
                }
            })
    } else {

        logger.error("Authorization token missing", 'AuthorizationMiddleware', 5);
        let apiResponse = responseLib.generate(true, 'AuthorizationToken is missing in request', 511, null);
        res.send(apiResponse);
    }
}

module.exports = {

    isAuthorized: isAuthorized
}