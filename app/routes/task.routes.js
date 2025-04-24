// Updated task routes for better handling of task completion
module.exports = (app) => {
  const task = require("../controllers/task.controller.js");
  const { authenticate, isAdmin } = require("../authorization/authorization.js");
  var router = require("express").Router();
    
  // Create a new task (admin only)
  router.post("/", [authenticate, isAdmin], task.create);
    
  // Retrieve all tasks
  router.get("/", [authenticate], task.findAll);
  
  // Get tasks by flight plan
  router.get("/flightplan/:flightPlanId", [authenticate], task.findByFlightPlan);
  
  // Get tasks by academic year
  router.get('/year/:year', [authenticate], task.findByApplicableYear);
  
  // Retrieve a single task with id
  router.get("/:id", [authenticate], task.findOne);
  
  // STUDENT ROUTES
  router.put("/:id/complete", [authenticate], task.completeTask);

  
  // ADMIN ROUTES for task review workflow
  router.patch("/:id/markComplete", [authenticate], task.markAsComplete);
  router.patch("/:id/approve", [authenticate, isAdmin], task.approveTask);
  router.patch("/:id/reject", [authenticate, isAdmin], task.rejectTask);
  
  // Update a task (admin only)
  router.put("/:id", [authenticate, isAdmin], task.update);
  
  // Delete a task (admin only)
  router.delete("/:id", [authenticate, isAdmin], task.delete);
  
  // Delete all tasks (admin only)
  router.delete("/", [authenticate, isAdmin], task.deleteAll);
    
  // Get tasks completed by a student
router.get("/student/:userId", [authenticate], task.getStudentTasksByUserId);

// Complete a task for a student (can be called by student themselves or admin)
router.post("/student/:userId/complete/:taskId", [authenticate], task.completeTaskForStudent);
  
  
  app.use("/flight-plan-t9/task", router);
};