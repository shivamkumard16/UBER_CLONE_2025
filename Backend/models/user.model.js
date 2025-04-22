const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userScahema = new mongoose.model({
    fullname: {
        firstname: {
            type: String,
            reuired: true,
            minlength: [3, "First length must be at least 3 characters long"]
        }
        ,
        lastname: {
            type: String,
            minlength: [3, "First length must be at least 3 characters long"]
        }
    },
    email: {
        type: String,
        reuired: true,
        unique: true,
        minlength: [5, "First length must be at least 5 characters long"]

    },
    password: {
        type: String,
        reuired: true,
        select: false
    },
    socketId: {
        type: String
    }

});


userScahema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

userScahema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password, this.password)
}


userScahema.statics.hashPassword=async(password)=>{
  return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('User',userScahema);

module.exports={userModel};