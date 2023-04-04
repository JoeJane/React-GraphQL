// Load the 'students' controller
var students = require('../../app/controllers/students.server.controller');
var express = require('express');
var router = express.Router();
// Define the routes module' method
module.exports = function (app) {
    
    //authenticate user
    app.post('/graphql/signin', students.authenticate);
    app.get('/graphql/signout', students.signout);
    app.get('/graphql/read_cookie', students.isSignedIn);

    
};

