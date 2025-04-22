const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,  // Corrected spelling of 'required'
            minlength: [3, "First name must be at least 3 characters long"]
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least 3 characters long"]
        }
    },
    email: {
        type: String,
        required: true,  // Corrected spelling of 'required'
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"]
    },
    password: {
        type: String,
        required: true,  // Corrected spelling of 'required'
        select: false
    },
    socketId: {
        type: String
    }
});

// Instance method to generate auth token
userSchema.methods.generateAuthToken = function () {
    // console.log(`instance based function generateAuthToken ke ander this -----= ${JSON.stringify(this.toObject())}\n\n`)

    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (password) {  // Changed to regular function
    // console.log(`instance based function comparePassword ke ander this = ${this.fullname}\n\n`)
    return await bcrypt.compare(password, this.password);
}

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {  // Corrected to static method
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };
