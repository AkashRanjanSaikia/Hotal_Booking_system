const express = require("express");
const { newBooking, getMyBookings } = require("./controller");
const authMiddleware = require("./middlewares");

const router = express.Router();

router.post("/",authMiddleware, newBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);

module.exports = router;
