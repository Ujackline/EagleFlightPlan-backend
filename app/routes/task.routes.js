

// module.exports = (app) => {
//   const task = require("../controllers/task.controller.js");
//   const { authenticate } = require("../authorization/authorization.js");
//   var router = require("express").Router();

//   // Create a new task
//   router.post("/", [authenticate], task.create);

//   // Retrieve all task
//   router.get("/", [authenticate], task.findAll);

//   // Retrieve a single task with id
//   router.get("/:id", [authenticate], task.findOne);

//   // Update a task with id
//   router.put("/:id", [authenticate], task.update);

//   // Delete a task with id
//   router.delete("/:id", [authenticate], task.delete);

//   // Delete all task
//   router.delete("/", [authenticate], task.deleteAll);

//   router.put("/:id/complete", [authenticate], task.completeTask);


//   app.use("/flight-plan-t9/task", router);
// };

module.exports = (app) => {
  const task = require("../controllers/task.controller.js");
  const { authenticate, isAdmin } = require("../authorization/authorization.js");
  var router = require("express").Router();
  // const { authenticate, isAdmin } = require("../middleware/authMiddleware"); // Import middleware


  // Create a new task
  // router.post("/", [authenticate], task.create);
  router.post("/", [authenticate, isAdmin], task.create);


  // Retrieve all task
  router.get("/", [authenticate], task.findAll);
  

  // Retrieve a single task with id
  router.get("/:id", [authenticate], task.findOne);

  router.put("/approve", [authenticate, isAdmin], task.approveTask);
  
  router.get("/pending", [authenticate, isAdmin], task.getPendingTasks);

  // Update a task with id
  router.put("/:id", [authenticate], task.update);

  // Delete a task with id
  router.delete("/:id", [authenticate], task.delete);

  router.post("/complete", task.completeTask);

  // Delete all task
  router.delete("/", [authenticate], task.deleteAll);

    // router.get("/notifications", [authenticate, isAdmin], notification.getNotifications);

  // router.put("/:id/complete", [authenticate], task.completeTask); 

  app.use("/flight-plan-t9/task", router);
};
