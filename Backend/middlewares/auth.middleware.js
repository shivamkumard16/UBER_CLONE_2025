const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");

module.exports.authUser = async (req, res, next) => {
    try {
        // 1. Get token from cookies or Authorization header
        const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token not provided" });
        }

        // 2. Check if token is blacklisted
        const isBlackListed = await blacklistTokenModel.findOne({ token });

        if (isBlackListed) {
            console.log("Token is blacklisted");
            return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
        }

        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get user by ID from decoded token
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Token is invalid or expired:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};
