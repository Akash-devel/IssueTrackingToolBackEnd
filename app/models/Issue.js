'use strict'
// Defining user Schema for Normal signup
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let issueSchema = new Schema({

    issueId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    /*comments: {
        type: String,
        default: ''
    }, 
    docs: {
        type: Array,
        default: ''
    }, */
    status: {
        type: String,
        default: 'In Progress'
    },
    reporter: {
        type: String,
        default: ''
    },
    assignee: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Issue', issueSchema)