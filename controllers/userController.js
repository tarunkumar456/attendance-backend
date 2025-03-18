const catchasyncerror = require("../middleware/catchasyncerror");
const userModels = require("../models/userModels");
const ErrorHandler = require('../utils/errorhandler');
const sendtoken = require('../utils/jwttoken');
const jwt = require('jsonwebtoken');

// Register User (Student or Teacher)
exports.registerUser = catchasyncerror(async (req, resp) => {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!["teacher", "student"].includes(role)) {
        return resp.status(400).json({
            success: false,
            message: "Invalid role. Role must be either 'teacher' or 'student'."
        });
    }

    const user = await userModels.create({ name, email, password, role });
    sendtoken(user, 201, resp);
});

// Login User
exports.loginUser = catchasyncerror(async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email & Password", 400));
    }

    const user = await userModels.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparepassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendtoken(user, 200, resp);
});

// Logout User
exports.logout = catchasyncerror((req, resp, next) => {
    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    resp.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

// Check if Authenticated
exports.isAuth = catchasyncerror(async (req, resp, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModels.findById(decoded.id);

    resp.status(200).json({
        success: true,
        role: req.user.role
    });
});
