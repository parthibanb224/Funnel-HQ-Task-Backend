const loginRouter = require('express').Router();
const userModel = require('../models/Users.models');
const session = require('express-session');
const { comparePasswords, generateToken } = require('../utils/Auth.utils');

loginRouter.use(session({
  secret: `${process.env.JWT_SECRET_KEY}`,
  resave: false,
  saveUninitialized: true,
}));

function cacheControl(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
}

loginRouter.post("/",cacheControl, async (req, res, next) => {
  const { mail, password } = req.body;

  req.session.user = { mail: mail, password: password };

  userModel.findOne({ mail: mail })
    .then(async (response) => {
      if (response && response._id) {
        const isMatching = await comparePasswords(password, response.password);
        if (isMatching) {
          const newToken = generateToken({
            name: response.fullName,
            role: ['user']
          },
            `${process.env.JWT_SECRET_KEY}`
          )
          return res.status(200).json({
            success: true,
            token: newToken,
            message: "Login Successful!!",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Email or Password is wrong, Try Again!!",
          });
        }
      } else {
        return res.status(200).json({
          success: false,
          message:
            "Account Does not Exists, Please create your account to continue!!",
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        success: false,
        message: "Error Fetching Users Data!!!",
        error: err,
      });
    });
});


loginRouter.post('/logout',cacheControl, (req, res) => {
  if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Logout failed');
        } else {
          res.send('Logged out successfully');
        }
      });
    } else {
      res.status(401).send('Session does not exist');
    }
});


module.exports = loginRouter;