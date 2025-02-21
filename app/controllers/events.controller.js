const db = require("../models");
const Event = db.Event;
const Op = db.Sequelize.Op;

// Create and Save a new Event
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventName || !req.body.id) {
    console.log(req.body);
    return res.status(400).send({ message: "Event name and user ID are required!" });
  }

  // Create an Event object
  const event = {
    eventName: req.body.eventName,
    id: req.body.id,
    // adminID: req.body.adminID,
    description: req.body.description,
    experience: req.body.experience,
    eventType: req.body.eventType, // je fais career_fair?
    eventDate: req.body.eventDate, 
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    location: req.body.location,
    attendanceType: req.body.attendanceType,
    registration: req.body.registration,
    completionType: req.body.completionType,

  };

  // Save Event in the database
  Eventvent.create(event)
    .then(data => res.send(data))
    .catch(err => {
      console.error("Error creating event:", err);
      console.log(Event);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the event."
      });
    });
};

// Retrieve all Events for a specific User
exports.findAllForUser = (req, res) => {
  const id = req.params.id;
  Event.findAll({ where: { id: id} })
    .then(data => res.send(data))
    .catch(err => {
      console.error("Error retrieving Events:", err);
      res.status(500).send({
        message: err.message || "Error retrieving Events."
      });
    });
};

// Find a single Event with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Event.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Cannot find Event with id=${id}.` });
      }
    })
    .catch(err => {
      console.error("Error retrieving Event with id:", id, err);
      res.status(500).send({
        message: err.message || `Error retrieving Event with id=${id}`
      });
    });
};

// Update a Event by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.eventName || !req.body.category) {
    return res.status(400).send({ message: "Event name and category are required for updating!" });
  }

  Event.update(req.body, { where: { id: id } })
    .then(num => {
      if (num === 1) {
        res.send({ message: "Event was updated successfully." });
      } else {
        res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.error("Error updating Event with id:", id, err);
      res.status(500).send({
        message: err.message || `Error updating Event with id=${id}`
      });
    });
};

// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Event.destroy({ where: { id: id} })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Event was deleted successfully!" });
      } else {
        res.status(404).send({
          message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
        });
      }
    })
    .catch(err => {
      console.error("Error deleting Event with id:", id, err);
      res.status(500).send({
        message: err.message || `Could not delete Event with id=${id}`
      });
    });
};

// Delete all Events from the database.
exports.deleteAll = (req, res) => {
  Event.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} Events were deleted successfully!` }))
    .catch(err => {
      console.error("Error removing all Events:", err);
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Events."
      });
    });
};