const express = require('express')
const connectDB = require("./config/db");
const listingRoutes = require("./routes/listingroutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const port = 8000


const app = express()

const allowedOrigins = [
  'http://localhost:3000',
  'https://cozy-stay-pi.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/listings", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
