const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" });
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        maxLength: [30, "Max length of password can be 30"],
        minLength: [8, "Min length of password can be 8"],
        select: false
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: [true, "Please select a role (Teacher or Student)"]
    },
    joinedAt: {
        type: Date,
        default: Date.now()
    }
});

// Hash password before saving to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Generate JWT token
userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Compare passwords
userSchema.methods.comparepassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};

module.exports = mongoose.model("users", userSchema);
