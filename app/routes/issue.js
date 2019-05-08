const express = require('express');
const issueController = require('./../controllers/issueController');
const appConfig = require('./../../config/appConfig');
const auth = require('./../middlewares/auth');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/users`;

  // Defining routes
  app.post(`${baseUrl}/addIssue`, issueController.createIssue);

  app.get(`${baseUrl}/getAllIssues`, issueController.getAllIssues);

  app.get(`${baseUrl}/getIssueById/:id`, issueController.getIssueByIssueId);

  app.put(`${baseUrl}/editIssue/:id`, issueController.updateIssue);
}