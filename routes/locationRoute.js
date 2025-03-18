const express = require("express");

const { addlocation, loc } = require("../controllers/locationController.js"); 

const router = express.Router();

router.post("/admin/addRoom", addlocation);

module.exports = router; // Use module.exports instead of export default

