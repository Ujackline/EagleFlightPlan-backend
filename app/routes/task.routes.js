
  
module.exports = (app) => {
  const task = require("../controllers/task.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  const { isAdmin} = require ("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new task
  router.post("/", [authenticate], task.create);

  // Retrieve all task
  router.get("/", [authenticate], task.findAll);

  // Retrieve a single task with id
  router.get("/:id", [authenticate], task.findOne);

  // Update a task with id
  router.put("/:id", [authenticate, isAdmin], task.update);

  // Delete a task with id
  router.delete("/:id", [authenticate, isAdmin], task.delete);

  // Delete all task
  router.delete("/", [authenticate, isAdmin], task.deleteAll);


  router.patch("/:id/markComplete", [authenticate], task.markAsComplete);
  router.patch("/:id/approve", [authenticate, isAdmin], task.approveTask);
  router.patch("/:id/reject", [authenticate, isAdmin], task.rejectTask);


  app.use("/flight-plan-t9/task", router);
};
