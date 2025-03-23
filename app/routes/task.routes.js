
  
module.exports = (app) => {
  const task = require("../controllers/task.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new task
  router.post("/", [authenticate], task.create);

  // Retrieve all task
  router.get("/", [authenticate], task.findAll);

  // Retrieve a single task with id
  router.get("/:id", [authenticate], task.findOne);

  // Update a task with id
  router.put("/:id", [authenticate], task.update);

  // Delete a task with id
  router.delete("/:id", [authenticate], task.delete);

  // Delete all task
  router.delete("/", [authenticate], task.deleteAll);

  app.use("/flight-plan-t9/task", router);
};
