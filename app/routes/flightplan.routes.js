module.exports = (app) => {
    const flightplan = require("../controllers/flightplan.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new flightplan
    router.post("/", [authenticate], flightplan.create);
  
    // Retrieve all flightplans
    router.get("/", [authenticate], flightplan.findAll);
  
    // Retrieve a single flightplan with id
    router.get("/:id", [authenticate], flightplan.findOne);


    // Update a flightplan with id
    router.put("/:id", [authenticate], flightplan.update);

    router.get("/:id/tasks", [authenticate], flightplan.getFlightPlanTasks);

    // Delete a flightplan with id
    router.delete("/:id", [authenticate], flightplan.delete);

    router.get("/calculate-year/:studentId", [authenticate], flightplan.calculateYearForStudent);
  
    // Delete all flightplans
    router.delete("/", [authenticate], flightplan.deleteAll);
    router.get("/student/:studentId/semester/:semester", [authenticate], flightplan.findByStudentAndSemester);
  
    app.use("/flight-plan-t9/flightplan", router);
  };
  