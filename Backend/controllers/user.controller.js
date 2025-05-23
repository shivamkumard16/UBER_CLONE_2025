const { userModel } = require("../models/user.model")
const { validationResult } = require('express-validator');
const userService = require('../services/user.services');
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'User already exists, cannot register' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser(
        {
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        }
    );

    console.log("\n\ninside of the user.register =  " + user);


    const token = user.generateAuthToken();

    res.status(200).json({ token, user });


}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    console.log("user controller = " + user);
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);
    return res.status(200).json({ token, user });

};


module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}



module.exports.logoutUser = async (req, res, next) => {

    const token = req.cookies.token || res.headers.authrization;

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}
