module.exports = (app) => {
    const admin = require("../controllers/admin.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new admin
    router.post("/", [authenticate], admin.create);
  
    // Retrieve all admins
    router.get("/", [authenticate], admin.findAll);
  
    // Retrieve a single admin with id
    router.get("/:id", [authenticate], admin.findOne);
  
    // Update a admin with id
    router.put("/:id", [authenticate], admin.update);
  
    // Delete a admin with id
    router.delete("/:id", [authenticate], admin.delete);
  
    // Delete all admin
    router.delete("/", [authenticate], admin.deleteAll);
  
    app.use("/flight-plan-t9/user", router);
  };
  