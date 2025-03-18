const express = require('express');
const { getData, registerUser, loginUser, logout, addData, isAuth,data } = require('../controllers/userController');
const isaunthenticated = require('../middleware/auth');

const router = express.Router();
router.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send('cors problem fixed:)');
});

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
// router.route('/logout').post(isaunthenticated,logout);
// router.route('/data').get(isaunthenticated,data);
// router.route('/getdata').get(isaunthenticated,getData);
// router.route('/adddata').put(isaunthenticated,addData);
router.route('/islogin').get(isAuth);

module.exports = router;
