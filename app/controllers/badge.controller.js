const db = require("../models");
const Badge = db.Badge;
const Op = db.Sequelize.Op;

// Create and Save a new Badge
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Badge name cannot be empty!"
    });
    return;
  }

  // Create a Badge
  const badge = {
    id: req.body.id,
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    points: req.body.points
  };

  // Save Badge in the database
  Badge.create(badge)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Badge."
      });
    });
};

// Retrieve all Badges from the database
exports.findAll = (req, res) => {
  Badge.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving badges."
      });
    });
};

// Find a single Badge with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Badge.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Badge with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving Badge with id=" + id
      });
    });
};
// Get all badges for a specific student
exports.findAllByStudentId = (req, res) => {
  const studentId = req.params.studentId;
  
  // Use Sequelize's association methods to fetch badges
  db.sequelize.query(
    `SELECT b.*, sb.DateAwarded 
     FROM badges b
     JOIN studentbadges sb ON b.id = sb.badgeId
     WHERE sb.studentId = :studentId`,
    {
      replacements: { studentId: studentId },
      type: db.sequelize.QueryTypes.SELECT
    }
  )
  .then(data => {
    res.send({
      data: data,
      message: `Found ${data.length} badges for student with id=${studentId}`
    });
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || `Error retrieving badges for student with id=${studentId}`
    });
  });
};

// Update a Badge by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Badge.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Badge was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Badge with id=${id}. Maybe Badge was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error updating Badge with id=" + id
      });
    });
};

// Delete a Badge with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Badge.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Badge was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Badge with id=${id}. Maybe Badge was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Could not delete Badge with id=" + id
      });
    });
};

// Delete all Badges from the database
exports.deleteAll = (req, res) => {
  Badge.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Badges were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all badges."
      });
    });
};

