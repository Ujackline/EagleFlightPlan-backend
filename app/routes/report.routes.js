module.exports = (app) => {
    const report = require("../controllers/report.controller.js");
    const { authenticate, isAdmin } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    router.post("/", [authenticate], report.create); // student submits
    router.get("/", [authenticate, isAdmin], report.findAll); // admins view all
  
    app.use("/flight-plan-t9/report", router);
  };
  