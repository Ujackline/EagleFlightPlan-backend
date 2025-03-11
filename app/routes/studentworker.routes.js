module.exports = (app) => {
    const studentworker = require("../controllers/studentworker.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new studentworker
    router.post("/", [authenticate], studentworker.create);
  
    // Retrieve all studentworkers
    router.get("/", [authenticate], studentworker.findAll);
  
    // Retrieve a single studentworker with id
    router.get("/:id", [authenticate], studentworker.findOne);
  
    // Update a studentworker with id
    router.put("/:id", [authenticate], studentworker.update);
  
    // Delete a studentworker with id
    router.delete("/:id", [authenticate], studentworker.delete);
  
    // Delete all studentworker
    router.delete("/", [authenticate], studentworker.deleteAll);
  
    app.use("/flight-plan-t9/studentworker", router);
  };
  