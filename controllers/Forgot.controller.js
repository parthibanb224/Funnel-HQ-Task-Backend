const forgotRouter = require('express').Router();
const userModel = require('../models/Users.models');
const nodemailer = require('nodemailer');


forgotRouter.put('/', async (req, res, next) => {
    const { mail } = req.body;
    await userModel.findOne({ mail })
      .then(async (response) => {
        if (response && response._id) {
          const randomString = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
          response.resetToken = randomString;
          await userModel.updateOne({ mail: mail }, response, { upsert: true, new: true });
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${process.env.NODEMAILER_EMAIL_ADDRESS}`,
              pass: `${process.env.NODEMAILER_PASSWORD}`
            }
          });
          const NODEMAILER_RESET_URL = process.env.NODE_ENVIRONMENT === 'development' ? `${process.env.NODEMAILER_RESET_URL_DEVELOPMENT}/reset/${randomString}` : `${process.env.NODEMAILER_RESET_URL_PRODUCTION}/reset/${randomString}` ;
          
          var mailOptions = {
            from: `"parthiban" <${process.env.NODEMAILER_EMAIL_ADDRESS}>`,
            to: response.mail,
            subject: 'Reset Password',
            text: NODEMAILER_RESET_URL
          };
  
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(401).json({
                success : false,
                message : "Email send Failed due to internet connectivity"
              })
            } else {
              return res.status(200).json({
                success: true,
                message: "Email send Successfully"
              })
            }
          });
        }
        else {
          return res.status(401).json({
            success: false,
            message: "Enter valid Email"
          })
        }
      })
  });


  module.exports = forgotRouter;