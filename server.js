// The server.js file is the main file of your Node.js application 
// It will load the express.js file as a module to bootstrap your Express application
//
//The process.env.NODE_ENV variable is set to the default 'development‘
//value if itdoesn 't exist.
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Load the module dependencies
var mongoose = require('./config/mongoose'),
    express = require('./config/express');
    var db = mongoose();

const{graphqlHTTP} = require('express-graphql');
var schema = require('./graphql/studentCourseSchemas');
var cors = require("cors");
var app = express();

app.use('*',cors());
app.use('/graphql',cors(),graphqlHTTP({
    schema: schema,
    rootValue: global,    
    graphiql: true,
}));

//app.use("/graphql",require("./app/routes/student.server.route"));


app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;