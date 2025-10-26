const express = require("express");
const { newBooking } = require("./controller");
const authMiddleware = require("./middlewares");

const router = express.Router();

router.post("/",authMiddleware, newBooking);

module.exports = router;
