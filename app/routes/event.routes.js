module.exports = (app) => {
  const eventController = require("../controllers/event.controller");
  const { authenticate } = require("../authorization/authorization.js");
  const { isAdmin } = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Standard CRUD Routes
  router.post("/", [authenticate], eventController.create); // Create new event
  router.get("/", [authenticate], eventController.findAll); // Get all events
  router.get("/:id", [authenticate], eventController.findOne); // Get single event
  router.put("/:id", [authenticate], eventController.update); // Update event
  router.delete("/:id", [authenticate], eventController.delete); // Delete event

  // Event-Specific Routes
  router.post("/:eventId/register/:studentId", [authenticate], eventController.registerStudent);
  router.post("/:eventId/attend/:studentId", [authenticate, isAdmin], eventController.markAttendance);
  router.get("/:eventId/registrations", [authenticate], eventController.getRegistrations);
  router.get("/semester/:semester", [authenticate], eventController.findBySemester);
  
  // Add these new routes
  router.post("/:eventId/code", [authenticate], eventController.generateAttendanceCode);
  router.post("/:eventId/verify/:studentId", [authenticate], eventController.verifyAttendance);
  router.get("/user/:studentId", [authenticate], eventController.getStudentEvents);
  router.delete("/:eventId/register/:studentId", [authenticate], eventController.cancelRegistration);

  router.get("/user/:userId", [authenticate], eventController.getEventsByUserId);

  // New routes for attendance approval system
  router.get("/approvals/pending", [authenticate, isAdmin], eventController.getPendingApprovals);
  router.post("/:eventId/students/:studentId/approve", [authenticate, isAdmin], eventController.approveAttendance);
  router.post("/:eventId/students/:studentId/reject", [authenticate, isAdmin], eventController.rejectAttendance);


  app.use("/flight-plan-t9/events", router);
};