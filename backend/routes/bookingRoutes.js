const express = require("express");
const { newBooking } = require("./controller");

const router = express.Router();

router.post("/", newBooking);

module.exports = router;
