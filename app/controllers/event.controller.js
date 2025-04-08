const db = require("../models");
const Event = db.Event;

// Create and Save a new Event
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.date) {
    return res.status(400).send({ message: "Event name and date are required!" });
  }

  // Create an Event object
  const event = {
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    event_type: req.body.event_type,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    location: req.body.location,
    semester: req.body.semester || "Spring 2024", // Add default semester if not provided
    major: req.body.major,
  };

  // Save Event in the database
  Event.create(event)
    .then(data => {
      return res.send(data);
    })
    .catch(err => {
      console.error("Error creating event:", err);
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the event."
      });
    });
};

// Retrieve all Events
exports.findAll = (req, res) => {
  Event.findAll() // Fetch all events
    .then(data => {
      console.log("Fetched Events from Database:", data); // Debugging
      return res.send(data);
    })
    .catch(err => {
      console.error("Error retrieving Events:", err);
      return res.status(500).send({
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
        return res.send(data);
      } else {
        return res.status(404).send({ message: `Cannot find Event with id=${id}.` });
      }
    })
    .catch(err => {
      console.error("Error retrieving Event with id:", id, err);
      return res.status(500).send({
        message: err.message || `Error retrieving Event with id=${id}`
      });
    });
};

// Update an Event by ID
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.name || !req.body.date) {
    return res.status(400).send({ message: "Event name and date are required for updating!" });
  }

  Event.update(req.body, { where: { id: id } })
    .then(([num]) => {
      if (num === 1) {
        return res.send({ message: "Event was updated successfully." });
      } else {
        return res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.error("Error updating Event with id:", id, err);
      return res.status(500).send({
        message: err.message || `Error updating Event with id=${id}`
      });
    });
};

// Delete an Event with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;
  Event.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        return res.send({ message: "Event was deleted successfully!" });
      } else {
        return res.status(404).send({
          message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
        });
      }
    })
    .catch(err => {
      console.error("Error deleting Event with id:", id, err);
      return res.status(500).send({
        message: err.message || `Could not delete Event with id=${id}`
      });
    });
};

// Delete all Events from the database
exports.deleteAll = (req, res) => {
  Event.destroy({ where: {}, truncate: false })
    .then(nums => {
      return res.send({ message: `${nums} Events were deleted successfully!` });
    })
    .catch(err => {
      console.error("Error removing all Events:", err);
      return res.status(500).send({
        message: err.message || "Some error occurred while removing all Events."
      });
    });
};