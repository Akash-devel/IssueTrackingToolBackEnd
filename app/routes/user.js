const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../../app/middlewares/auth');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/users`;

  // Defining routes
  app.post(`${baseUrl}/register`, userController.signUpFunction);

  /**
	 * @api {post} /api/v1/users/register api for user signup
	 * @apiVersion 0.0.1
	 * @apiGroup users
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "User Created",
	    "status": 200,
	    "data": [
					{
						userId: "string",
						fullName: "string",
						email: "string",
						password: "string",
						resetPasswordToken: "string",
						createdOn: "date",
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Create User",
	    "status": 500,
	    "data": null
	   }
	 */

  app.post(`${baseUrl}/login`, userController.loginFunction);

  /**
	 * @api {post} /api/v1/users/login api for user login
	 * @apiVersion 0.0.1
	 * @apiGroup users
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Login Successfull",
	    "status": 200,
	    "data": [
					{
            "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IkxyVERCZG5IWSIsImlhdCI6MTU1NzM1Mjc5MjY3MSwiZXhwIjoxNTU3NDM5MTkyLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJha1RvZG8iLCJkYXRhIjp7InVzZXJJZCI6IjBnS25qdDdYcSIsImZ1bGxOYW1lIjoiQWthc2giLCJlbWFpbCI6ImE3ODcybW9rQGtvbC5jb20iLCJyZXNldFBhc3N3b3JkVG9rZW4iOiJBT1gzIn19.0x1cXqKaEyhd2QkRB4Vo2a6BlhpE2b5WGRzPZge7dd0",
        "userDetails": {
            "userId": "0gKnjt7Xq",
            "fullName": "Akash",
            "email": "a7872mok@kol.com",
            "resetPasswordToken": "AOX3"
        }
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Wrong Password. Login Failed",
	    "status": 403,
	    "data": null
	   }
	 */

  app.post(`${baseUrl}/forgotPwd`, userController.forgotPwd);

  /**
	 * @api {post} /api/v1/users/forgotPwd api for user forgot password
	 * @apiVersion 0.0.1
	 * @apiGroup users
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
    "mesaage": "Password reset link sent",
    "status": 200,
    "data": [
        {
            "statusCode": 202,
            "headers": {
                "server": "nginx",
                "date": "Wed, 08 May 2019 22:02:12 GMT",
                "content-length": "0",
                "connection": "close",
                "x-message-id": "FyUP5C_YTaOZo2StbzhppA",
                "access-control-allow-origin": "https://sendgrid.api-docs.io",
                "access-control-allow-methods": "POST",
                "access-control-allow-headers": "Authorization, Content-Type, On-behalf-of, x-sg-elas-acl",
                "access-control-max-age": "600",
                "x-no-cors-reason": "https://sendgrid.com/docs/Classroom/Basics/API/cors.html"
            },
            "request": {
                "uri": {
                    "protocol": "https:",
                    "slashes": true,
                    "auth": null,
                    "host": "api.sendgrid.com",
                    "port": 443,
                    "hostname": "api.sendgrid.com",
                    "hash": null,
                    "search": null,
                    "query": null,
                    "pathname": "/v3/mail/send",
                    "path": "/v3/mail/send",
                    "href": "https://api.sendgrid.com/v3/mail/send"
                },
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "User-agent": "sendgrid/6.3.0;nodejs",
                    "Authorization": "Bearer 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",
                    "content-type": "application/json",
                    "content-length": 568
                }
            }
        },
        null
    ]
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": true,
    "mesaage": "No email found for this user",
    "status": 403,
    "data": null
    }
	 */

  app.post(`${baseUrl}/change-password/:tokenId`, userController.changePassword);

  app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logOut);

  /**
	 * @api {post} /api/v1/users/logout api for user logout
	 * @apiVersion 0.0.1
	 * @apiGroup users
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
    "error": false,
    "mesaage": "Successfully logged out",
    "status": 200,
    "data": null
      }

	   @apiErrorExample {json} Error-Response:
	 *
	 * {
    "error": true,
    "mesaage": "Invalid Or Expired AuthorizationKey",
    "status": 511,
    "data": null
    }
	 */
}