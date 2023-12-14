const resetRouter = require('express').Router();
const userModel = require('../models/Users.models');
const bcrypt = require("bcrypt");
const saltRounds = 10;

resetRouter.patch("/:id", async (req, res) => {
    try {
      const resetToken = req.params.id;
      const { password } = req.body;
      const matchedUser = await userModel.findOne({ resetToken });
      if (!matchedUser) {
        res.status(400).json({ Err: "user not found exists" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      matchedUser.password = hashedPassword;
  
      await userModel.findByIdAndUpdate(matchedUser.id, matchedUser);
      res.status(201).json({
        success : true,
        message: `${matchedUser.fullName} password has beed changed sucessfully`,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  });


  module.exports = resetRouter;