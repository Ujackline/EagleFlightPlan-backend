module.exports = (app) => {
  const student = require("../controllers/student.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  const router = require("express").Router();

  // CRUD
  router.post("/", [authenticate], student.create);
  router.get("/", [authenticate], student.findAll);
  router.get("/:id", [authenticate], student.findOne);
  router.put("/:id", [authenticate], student.update);
  router.delete("/:id", [authenticate], student.delete);
  router.delete("/", [authenticate], student.deleteAll);

  // ✅ Point-related routes
  router.get("/:id/points", [authenticate], student.getPoints);
  router.patch("/:id/addPoints", [authenticate], student.addPoints);
  router.patch("/:id/redeemPoints", [authenticate], student.redeemPoints);

  app.use("/flight-plan-t9/student", router);
};
