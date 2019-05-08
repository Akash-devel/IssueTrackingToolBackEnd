'use strict'
// Defining user Schema for Normal signup
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new Schema({

    userId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
        unique: true
    },
    password: {
        type: String,
        default: 'jfdnakfnkaeptogpjrgnl'
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    createdOn: {
        type: Date,
        default: ''
    }
})


module.exports = mongoose.model('User', userSchema)