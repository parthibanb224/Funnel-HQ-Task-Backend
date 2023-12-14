const SignUpRouter = require('express').Router();
const userModel = require('../models/Users.models');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require('nodemailer');

SignUpRouter.post('/createUser', async (req, res, next) => {
    const data = req.body;
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        if (!hash) {
            return res.status(400).json({
                message: "Password is not in the required format",
            });
        }

        const verificationToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        const newUser = new userModel({ ...data, password: hash, verificationToken });
        const savedUser = await newUser.save();

        // Send verification email
        const verificationLink = process.env.NODE_ENVIRONMENT === 'development' ? `${process.env.VERIFICATION_URL_DEVELOPMENT}/verification-success/${verificationToken}` : `${process.env.VERIFICATION_URL_PRODUCTION}/verification-success/${verificationToken}`;
        const mailOptions = {
            from: `"parthiban" <${process.env.NODEMAILER_EMAIL_ADDRESS}>`,
            to: savedUser.mail,
            subject: 'Verify Your Email',
            text: `Click the following link to verify your email: ${verificationLink}`,
        };

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.NODEMAILER_EMAIL_ADDRESS}`,
                pass: `${process.env.NODEMAILER_PASSWORD}`,
            },
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(401).json({
                    success: false,
                    message: "Email send failed due to internet connectivity",
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Verification email sent successfully",
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Data added failed",
            Error: error,
        });
    }
});

module.exports = SignUpRouter;
