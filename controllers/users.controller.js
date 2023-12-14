const usersRouter = require('express').Router();
const userModel = require('../models/Users.models');


usersRouter.get('/:id', (req,res,next) => {
    const fullName = req.params.id;
    userModel.findOne({fullName})
        .then(response => {
            return res.status(200).json({
                result : response,
                success : true,
                message : "users fetch successfully"
            })
        })
        .catch(err => {
            return res.status(401).json({
                success : false,
                message : "users fetch failed",
                Error : err
            })
        })
})

module.exports = usersRouter;