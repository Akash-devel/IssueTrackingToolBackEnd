const express = require('express');
const issueController = require('./../controllers/issueController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/users`;

  // Defining routes
  app.post(`${baseUrl}/addIssue`, issueController.createIssue);

   /**
	 * @api {post} /api/v1/users/addIssue api for user signup
	 * @apiVersion 0.0.1
	 * @apiGroup issues
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

  app.get(`${baseUrl}/getAllIssues`, issueController.getAllIssues);

  app.get(`${baseUrl}/getIssueById/:id`, issueController.getIssueByIssueId);

  app.put(`${baseUrl}/editIssue/:id`, issueController.updateIssue);
}