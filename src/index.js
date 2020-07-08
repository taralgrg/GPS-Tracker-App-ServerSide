// Creating express server bare minimum
// creating one single route
// make sure our express servers listens to some port in local machine
// use web-browser to test route and make sure content is visible
require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
//bodyParser is a helper function that will automatically parse
//information associated with the body property of incoming request.
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

//bodyParser has to be directly above authRoutes.
//It is going to parse some json data out of incoming request.
//It is going to place all information on the body property of Req object in router.post
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri =
  "mongodb+srv://admin:passwordpassword@cluster0-jebkb.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});
mongoose.connection.on("error", err => {
  console.log("Error connecting to mongo", err);
});

//when someone makes request to our root route ,
//run middleware (requireAuth)  first to check JWT is valid
//and then allow them to access route handler (req,res)
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
