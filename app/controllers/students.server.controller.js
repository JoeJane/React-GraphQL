// Load the module dependencies
const User = require("mongoose").model("Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const jwtExpirySeconds = 300;
const jwtKey = config.secretKey;

//
// authenticates a user
exports.authenticate = async function (req, res, next) {
  // Get credentials from request
  console.log(req.body);
  const studentNumber = req.body.auth.studentNumber;
  const password = req.body.auth.password;
  //find the user with given studentNumber using static method findOne
  User.findOne({ studentNumber: studentNumber }, (err, user) => {
    if (err) {
      return next(err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      //compare passwords
      // Create a new token with the user id in the payload
      // and which expires 300 seconds after issue
      const token = jwt.sign(
        { id: user._id, studentNumber: user.studentNumber },
        jwtKey,
        { algorithm: "HS256", expiresIn: jwtExpirySeconds }
      );
      // set the cookie as the token string, with a similar max age as the token
      // here, the max age is in milliseconds
      res.cookie("token", token, {
        maxAge: jwtExpirySeconds * 1000,
        httpOnly: true,
      });
      res.status(200).send({
        studentNumber: user.studentNumber,
        id: user._id,
        isadmin: user.isAdmin,
        name: user.firstName + ", " + user.lastName,
      });
      //

      req.user = user;
      //call the next middleware
      next();
    } else {
      res.json({
        status: "error",
        message: "Invalid Student Number or password!",
        data: null,
      });
    }
  });
};
//
// protected page uses the JWT token
exports.welcome = (req, res) => {
  // We can obtain the session token from the requests cookies,
  // which come with every request
  const token = req.cookies.token;
  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).end();
  }

  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }

  // Finally, return the welcome message to the user, along with their
  // studentNumber given in the token
  // use back-quotes here
  res.send(`${payload.studentNumber}`);
};

//
//sign out function in controller
//deletes the token on the client side by clearing the cookie named 'token'
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "signed out" });
};


//check if the user is signed in
exports.isSignedIn = (req, res) => {
  // Obtain the session token from the requests cookies,
  // which come with every request
  const token = req.cookies.token;
  // if the cookie is not set, return 'auth'
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }

  // Finally, token is ok, return the studentNumber given in the token
  res.status(200).send({ screen: payload.studentNumber, id: payload._id });
};

//isAuthenticated() method to check whether a user is currently authenticated
exports.requiresLogin = function (req, res, next) {
  // Obtain the session token from the requests cookies,
  // which come with every request
  const token = req.cookies.token;
  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.send({ screen: "auth" }).end();
  }
  var payload;
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey);
    console.log("in requiresLogin - payload:", payload);
    req.id = payload.id;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end();
    }
    // otherwise, return a bad request error
    return res.status(400).end();
  }
  // user is authenticated
  //call next function in line
  next();
};
