const jwt = require('jsonwebtoken');
const blacklistModel =require('../models/blacklistToken.model');
const { userModel } = require('../models/user.model');
const { captainModel } = require('../models/captain.model');
module.exports.authCaptain = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authrization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blacklistModel.findOne({token});
    if(isBlackListed){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });
    }



}