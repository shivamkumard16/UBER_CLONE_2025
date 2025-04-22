const { userModel } = require("../models/user.model");

module.exports.createUser = async ({ firstname, lastname, email, password }) => {

    if (!firstname || !email || !password) {
        throw Error("All fields are required");
    }

    const newUser = userModel.create(
        {
            fullname: {
                firstname,
                lastname
            },
            email,
            password
        }
    );
    console.log("inside of the user.model.js =  " + newUser);
    return newUser;

}

