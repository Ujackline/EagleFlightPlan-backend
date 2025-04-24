const db = require("../models");
const Badge = db.Badge;
const Op = db.Sequelize.Op;

// Create and Save a new Badge
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: "Badge name cannot be empty!" });
    return;
  }

  const badge = {
    id: req.body.id,
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    points: req.body.points
  };

  Badge.create(badge)
    .then(data => res.send(data))
    .catch(err =>
      res.status(500).send({ message: err.message || "Error creating badge." })
    );
};

// Retrieve all Badges
exports.findAll = (req, res) => {
  Badge.findAll()
    .then(data => res.send(data))
    .catch(err =>
      res.status(500).send({ message: err.message || "Error retrieving badges." })
    );
};

// Find one Badge by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Badge.findByPk(id)
    .then(data => {
      if (data) res.send(data);
      else res.status(404).send({ message: `No badge found with id=${id}.` });
    })
    .catch(err =>
      res.status(500).send({ message: err.message || "Error retrieving badge." })
    );
};

// Get all badges for a specific student
exports.findAllByStudentId = (req, res) => {
  const studentId = req.params.studentId;

  if (!studentId) {
    res.status(400).send({ message: "Student ID cannot be empty!" });
    return;
  }

  db.sequelize.query(
    `SELECT b.*, sb.DateAwarded 
     FROM badges b
     JOIN studentbadges sb ON b.id = sb.badgeId
     WHERE sb.studentId = :studentId`,
    {
      replacements: { studentId },
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

// Check and award automatic badges based on points
exports.checkAutomaticBadges = async (req, res) => {
  const { studentId, points } = req.body;

  if (!studentId || points === undefined) {
    res.status(400).send({ message: "Student ID and points are required!" });
    return;
  }

  try {
    // Find qualifying badges based on points
    const qualifyingBadges = await Badge.findAll({
      where: { points: { [Op.lte]: points } }
    });

    // Get student's current badges
    const currentBadges = await db.sequelize.query(
      `SELECT badgeId FROM studentbadges WHERE studentId = :studentId`,
      {
        replacements: { studentId },
        type: db.sequelize.QueryTypes.SELECT
      }
    );

    const currentBadgeIds = currentBadges.map(b => b.badgeId);

    // Filter out already awarded ones
    const newBadges = qualifyingBadges.filter(
      badge => !currentBadgeIds.includes(badge.id)
    );

    // Insert new badges if there are any
    if (newBadges.length > 0) {
      const values = newBadges.map(badge => ({
        studentId,
        badgeId: badge.id,
        DateAwarded: new Date()
      }));

      // await db.sequelize.query(
      //   `INSERT INTO studentbadges (studentId, badgeId, DateAwarded) VALUES ${
      //     values.map(() => '(?, ?, ?)').join(',')
      //   }`,
      //   {
      //     replacements: values.flatMap(v => [v.studentId, v.badgeId, v.DateAwarded]),
      //     type: db.sequelize.QueryTypes.INSERT
      //   }
      // );
    }

    res.send({
      newBadgesAwarded: newBadges.length > 0,
      newBadges: newBadges,
      message: `Awarded ${newBadges.length} new badge(s) to student with id=${studentId}`
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error checking automatic badges"
    });
  }
};

// Update a Badge
exports.update = (req, res) => {
  const id = req.params.id;

  Badge.update(req.body, { where: { id } })
    .then(num => {
      if (num == 1) res.send({ message: "Badge updated successfully." });
      else res.send({ message: `Cannot update Badge with id=${id}.` });
    })
    .catch(err =>
      res.status(500).send({ message: err.message || "Error updating Badge." })
    );
};

// Delete a Badge
exports.delete = (req, res) => {
  const id = req.params.id;

  Badge.destroy({ where: { id } })
    .then(num => {
      if (num == 1) res.send({ message: "Badge deleted successfully." });
      else res.send({ message: `Cannot delete Badge with id=${id}.` });
    })
    .catch(err =>
      res.status(500).send({ message: err.message || "Error deleting Badge." })
    );
};

// Delete all Badges
exports.deleteAll = (req, res) => {
  Badge.destroy({ where: {}, truncate: false })
    .then(nums => res.send({ message: `${nums} Badges deleted.` }))
    .catch(err =>
      res.status(500).send({ message: err.message || "Error deleting all badges." })
    );
};
