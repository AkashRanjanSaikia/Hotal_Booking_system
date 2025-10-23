const express = require('express')
const connectDB = require("./config/db");
const listingRoutes = require("./routes/listingroutes");
const bookingRoutes = require("./routes/bookingRoutes");

const cors = require("cors");
const port = 8000


const app = express()

app.use(cors());
app.use(express.json());

connectDB();

app.use("/listings", listingRoutes);
app.use("/bookings", bookingRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
