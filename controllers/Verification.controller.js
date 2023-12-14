const express = require('express');
const verificationRouter = express.Router();
const userModel = require('../models/Users.models');

verificationRouter.get('/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Find the user with the given verification token
        const user = await userModel.findOne({ verificationToken: token });

        if (user) {
            // Mark the user as verified and remove the verification token
            user.isVerified = true;
            user.verificationToken = undefined;

            // Save the updated user
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Email verification successful. You can now log in.",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Invalid verification token. Please try again.",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during email verification.",
            error: error,
        });
    }
});

module.exports = verificationRouter;
