const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" });
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "plese enter name"]
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        unique: true,
        vlaidate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter password"],
        maxLength: [30, "max length of password can be 30"],
        minLength: [8, "min length of password can be 8"],
        select: false
    },
    joinedAt: {
        type: Date,
        default: Date.now()
    }

})
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//jwt token
userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
//check password
userSchema.methods.comparepassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
}


module.exports = mongoose.model("users", userSchema)