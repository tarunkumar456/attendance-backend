const catchasyncerror = require("../middleware/catchasyncerror");
const userModels = require("../models/userModels");
const ErrorHandler = require('../utils/errorhandler');
const sendtoken = require('../utils/jwttoken');
const jwt = require('jsonwebtoken')

exports.registerUser = catchasyncerror(async (req, resp) => {
    const { name, email, password } = req.body;
    const user = await userModels.create({
        name, email, password
    })
    sendtoken(user, 201, resp);
})
//login user
exports.loginUser = catchasyncerror(async (req, resp, next) => {
    const { email, password } = req.body;
    //check if both present
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await userModels.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invlaid Email & Password", 401))
    }
    const isPasswordMatched = await user.comparepassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invlaid Email & Password", 401))
    }

    sendtoken(user, 200, resp);
})

// //logout user
exports.logout = catchasyncerror((req, resp, next) => {

    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure:true,
        sameSite: 'None'
    })
    resp.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

//get data
// exports.getData = catchasyncerror(async (req, resp, next) => {
//     let user = await userModels.find({ _id: req.user._id });
//     if (!user) return next(new ErrorHandler("User not found", 404))
//     let quiz = user[0]

//     resp.status(200).json({
//         success: true,
//         quiz
//     });
// })


// //add data
// exports.addData = catchasyncerror(async (req, resp, next) => {
//     const newquiz = {
//         marks: req.body.marks,
//         correct: req.body.correct,
//         accuracy: req.body.accuracy,
//         averagetime: req.body.avg
//     }
//     const user = await userModels.find({ _id: req.user._id });
//     if (!user) return next(new ErrorHandler("User not found", 404))
//     user[0].quiz.push(newquiz)
//     await user[0].save({ validateBeforeSave: false });
//     resp.status(200).json({
//         success: true,
//         user
//     });
// })



// //authenticated
exports.isAuth = catchasyncerror(async (req, resp, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("please login to access it", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModels.findById(decoded.id);
    resp.status(200).json({
        success: true
    });


})

// //get all data
// exports.data = catchasyncerror(async (req, resp, next) => {
//     let user = await userModels.find();
//     if (!user) return next(new ErrorHandler("User not found", 404))
//     let quiz = user

//     resp.status(200).json({
//         success: true,
//         quiz
//     });
// })