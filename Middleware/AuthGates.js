const {verifyTokenValidity} = require('../utils/Auth.utils');

function tokenGate(req,res,next){
    if(verifyTokenValidity(req.header("Authorization"),`${process.env.JWT_SECRET_KEY}`)){
        next();
    }
    else{
        return res.status(401).json({
            success : false,
            message : "session Expired. Login again to Continue"
        })
    }
}

module.exports = {tokenGate};