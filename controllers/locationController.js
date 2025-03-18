const  catchasyncerror  = require("../middleware/catchasyncerror");
const ErrorHandler = require("../middleware/error");
const { Location } = require("../models/locationModels");

const addlocation = catchasyncerror(async (req, res, next) => {
  const { roomNo, coordinates } = req.body;

  if (!roomNo || !coordinates || coordinates.length !== 4) {
    return next(
      new ErrorHandler("Please provide room number and exactly 4 coordinates!", 400)
    );
  }

  const room = await Location.create({
    roomNo,
    cor1_lat: coordinates[0].lat,
    cor1_long: coordinates[0].long,
    cor2_lat: coordinates[1].lat,
    cor2_long: coordinates[1].long,
    cor3_lat: coordinates[2].lat,
    cor3_long: coordinates[2].long,
    cor4_lat: coordinates[3].lat,
    cor4_long: coordinates[3].long,
  });

  res.status(201).json({
    success: true,
    message: "Room location added successfully",
    room,
  });
});

const loc = catchasyncerror(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Hello World",
  });
});

module.exports = { addlocation, loc }; // Use module.exports instead of export
