const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");

// API
const UserApi = require("./api/routes/user");
const HotelApi = require("./api/routes/Hotel");
const AdminApi = require("./api/routes/admin");
const ContactApi = require("./api/routes/contact");
const BookingHotelApi = require("./api/routes/PagesRoute/BookingHotel");
const AboutApi = require("./api/routes/PagesRoute/about");
const SliderApi = require("./api/routes/PagesRoute/Slider");
const TableBookApi = require("./api/routes/PagesRoute/BookingTable");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./api/config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoose Connect"))
  .catch((err) => console.log(err));

app.use(morgan("dev"));

// Cross Platfrom request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(passport.initialize());
require("./api/config/passport")(passport);

// Routes
app.use("/api/user", UserApi);
app.use("/api/hotel", HotelApi);
app.use("/api/admin", AdminApi);
app.use("/api/conact", ContactApi);
app.use("/api/bookingHotel", BookingHotelApi);
app.use("/api/about", AboutApi);
app.use("/api/slider", SliderApi);
app.use("/api/tableBook", TableBookApi);


app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message,
    },
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server renning port ${port}`));
