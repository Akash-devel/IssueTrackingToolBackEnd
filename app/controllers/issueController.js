const mongoose = require('mongoose');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const token = require('../libs/tokenLib');
const validateInput = require('../libs/paramsValidationLib');

/*Models */
const IssueModel = require('./../models/Issue');
const UserModel = require('./../models/User');
const AuthModel = require('./../models/Auth');

let createIssue = (req, res) => {

    // Finding authToken to retrieve userId from AuthModel
    let findUserIdFromAuthToken = () => {

        return new Promise((resolve, reject) => {

            AuthModel.findOne({ authToken: req.body.authToken }, function (err, retrieveAuthObj) {

                if (err) {

                    logger.error(err.message, 'issueController: createIssue()', 10);
                    let apiResponse = response.generate(true, 'Error in finding AuthToken', 500, null);
                    reject(apiResponse);
                }
                else {
                    //console.log("I am in AuthMOdel.find method()----------------->");
                    //console.log("userId ------------ ", retrieveAuthObj.userId);
                    let apiResponse = response.generate(false, 'AuthToken Found', 200, retrieveAuthObj);
                    resolve(apiResponse);
                }
            })
        })
    }

    // Finding authToken to retrieve userId from AuthModel
    let findFullName = (UserIDinfo) => {

        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: UserIDinfo.data.userId }, function (err, fetchUserObj) {

                if (err) {

                    logger.error(err.message, 'issueController: createIssue()', 10);
                    let apiResponse = response.generate(true, 'Error in finding userId from UserModel', 500, null);
                    reject(apiResponse.status);
                } else {

                    console.log("FullName:- ", fetchUserObj.fullName);
                    logger.info('UserId found from UserModel', 'issueController: createIssue()', 10);
                    let apiResponse = response.generate(false, 'FullName retrieved', 200, fetchUserObj);
                    resolve(apiResponse);
                }
            })
        })
    }

    // Saving reporter of the bug into the Schema
    let reporterOfBug = (fetchUserObj) => {

        return new Promise((resolve, reject) => {
            
            // Counting no. of documents so that issueId is uniquinely incremented 
            IssueModel.find().estimatedDocumentCount({}, function (err, cntDoc) {

                if (err) {
                    reject(err);
                }
                else {
                    let nIssue = cntDoc + 10000 + '';
                    let newIssue = new IssueModel({
                        issueId: nIssue,
                        title: req.body.title,
                        description: req.body.description,
                        status: req.body.status,
                        assignee: req.body.assignee,
                        reporter: fetchUserObj.data.fullName,
                        dateCreated: time.now()
                    })

                    newIssue.save(function (err, newIssue) {
                        if (err) {
                            console.log("Error saving Issue :: ", err);
                            reject(err);
                        }
                        else {
                            let newIssueObj = newIssue.toObject();
                            console.log('New Issue:-> ' + newIssueObj.issueId);
                            logger.info('Issue Created', 'issueController: createIssue', 10);
                            let apiResponse = response.generate(false, 'Issue Created', 200, newIssueObj);
                            resolve(apiResponse);
                        }
                    })
                }
            })
        })
    }

    findUserIdFromAuthToken(req, res)
        .then(findFullName)
        .then(reporterOfBug)
        .then((resolve) => {

            let apiResponse = response.generate(false, "Issue Created Successfuly", 200, resolve);
            console.log(apiResponse);
            res.send(apiResponse);
        })
        .catch((err) => {

            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })

} // end of createIssue

let getAllIssues = (req, res) => {

    if(req.params) {

        IssueModel.find()
                  .select('-__v -_id')
                  .lean()
                  .exec((err, result)  => {
                    
                    if (err) {
                        
                        logger.error(err.message, 'IssueController: getAllIssues', 10)
                        let apiResponse = response.generate(true, 'Failed to Find Issue Details', 500, null);
                        res.send(apiResponse);
        
                    } else if(check.isEmpty(result)) {

                        logger.info('No Blog Found', 'IssueController: getAllIssues')
                        let apiResponse = response.generate(true, 'No Issue Found', 403, null);
                        res.send(apiResponse);
        
                    } else {

                        let apiResponse = response.generate(false, 'All Issue Details Found', 200, result);
                        res.send(apiResponse)
                    }
                })
    } else {

        console.log('No Issue details arrived from the client side');
    }

} // end of getAllIssues

let getIssueByIssueId = (req, res) => {

    if (check.isEmpty(req.params.id)) {

        console.log('IssueId should be passed')
        let apiResponse = response.generate(true, 'IssueId is missing', 400, null)
        res.send(apiResponse)

    } else {

        console.log(typeof(req.params.id));
        IssueModel.findOne({ issueId: req.params.id }, (err, result) => {

            if (err) {
                
                logger.error(`Error Occured : ${err}`, 'IssueController: getIssueByIssueId()', 10)
                let apiResponse = response.generate(true, "Error occured.", 500, null)
                res.send(apiResponse);

            } else if (check.isEmpty(result)) {

                logger.error(`Error Occured : ${err}`, 'No Issue Found by that Issue ID', 5)
                let apiResponse = response.generate(true, "No Issue Found by that Issue ID", 403, null);
                res.send(apiResponse);

            } else {
                logger.info("Issue found successfully", "IssueController: getIssueByIssueId()", 5)
                let apiResponse = response.generate(false, "Issue Found Successfully", 200, result)
                res.send(apiResponse);
            }
        })
    }
} // end of getIssueByIssueId

let updateIssue = (req, res) => {

    let options = req.body;
    console.log(options);

    IssueModel.updateOne({ 'issueId': req.params.id }, { $set: options })
              .exec((err, result) => {

            if (err) {
                
                logger.error(err.message, "IssueController: updateIssue()", 10)
                let apiResponse = response.generate(true, "Error Occured while Editing the blog", 500, null)
                res.send(apiResponse);

            } else if (check.isEmpty(result)) {

                logger.error(err.message, "IssueController: updateIssue()", 5);
                let apiResponse = response.generate(true, "No Issue Found by that Issue Id", 403, null)
                res.send(apiResponse);

            } else {

                logger.info("Blog Updated Successfully", "IssueController: updateIssue()", 5);
                let apiResponse = response.generate(false, "Issue Edited Successfully", 200, result);
                res.send(apiResponse);
            }
        })
} // end of updateIssue


module.exports = {

    createIssue: createIssue,
    getAllIssues: getAllIssues,
    getIssueByIssueId: getIssueByIssueId,
    updateIssue: updateIssue,
}