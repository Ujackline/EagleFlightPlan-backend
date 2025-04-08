require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");

db.sequelize.sync({force: false});

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.options("*", cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/experience.routes.js")(app);
require("./app/routes/admin.routes.js")(app);
require("./app/routes/award.routes.js")(app);
require("./app/routes/badge.routes.js")(app);
require("./app/routes/event.routes.js")(app);
require("./app/routes/task.routes.js")(app);
require("./app/routes/student.routes.js")(app);
require("./app/routes/flightplan.routes.js")(app);
require("./app/routes/notification.routes.js")(app);
require("./app/routes/studentworker.routes.js")(app);


// set port, listen for requests
const PORT = process.env.PORT || 3029;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
