const db = require("../models");
const Semester = db.Semester;
const { Op } = db.Sequelize;

exports.create = async (req, res) => {
  try {
    // Validate request
    const { name, code, start_date, end_date, academic_year, is_active } = req.body;

    if (!name || !code || !start_date || !end_date || !academic_year) {
      return res.status(400).send({
        message: "Name, code, start date, end date, and academic year are required!"
      });
    }

    // Create semester
    const semester = await Semester.create({
      name,
      code,
      start_date,
      end_date,
      academic_year,
      is_active: is_active || false
    });

    res.status(201).send(semester);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error creating semester",
      errors: err.errors
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const semesters = await Semester.findAll({
      attributes: ['id', 'name', 'code', 'start_date', 'end_date', 'academic_year', 'is_active'],
      order: [['start_date', 'DESC']],
      include: [
        { model: db.Student, as: 'currentStudents' },
        { model: db.Student, as: 'graduatingStudents' },
        { model: db.Student, as: 'enrolledStudents' }
      ]
    });
    res.send(semesters);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error retrieving semesters"
    });
  }
};

exports.findActive = async (req, res) => {
  try {
    const activeSemester = await Semester.findOne({ 
      where: { is_active: true },
      attributes: ['id', 'name', 'code', 'start_date', 'end_date', 'academic_year']
    });

    if (!activeSemester) {
      return res.status(404).send({
        message: "No active semester found"
      });
    }

    res.send(activeSemester);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error finding active semester"
    });
  }
};

// Find a single Semester by id
exports.findOne = async (req, res) => {
  try {
    const semester = await Semester.findByPk(req.params.id, {
      include: [
        { model: db.Student, as: 'currentStudents' },
        { model: db.Student, as: 'graduatingStudents' },
        { model: db.Student, as: 'enrolledStudents' }
      ]
    });
    
    if (semester) {
      res.send(semester);
    } else {
      res.status(404).send({
        message: `Cannot find Semester with id=${req.params.id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving Semester with id=" + req.params.id
    });
  }
};

// Update a Semester by id
exports.update = (req, res) => {
  const id = req.params.id;

  Semester.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Semester was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Semester with id=${id}. Maybe Semester was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Semester with id=" + id
      });
    });
};

// Set a semester as active and deactivate others
exports.setActive = (req, res) => {
  const id = req.params.id;

  // First, set all semesters to inactive
  Semester.update({ is_active: false }, { where: {} })
    .then(() => {
      // Then set the specified semester to active
      return Semester.update({ is_active: true }, { where: { id: id } });
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Semester was set as active successfully."
        });
      } else {
        res.send({
          message: `Cannot set Semester with id=${id} as active. Maybe Semester was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error setting active Semester with id=" + id
      });
    });
};

// Delete a Semester by id
exports.delete = (req, res) => {
  const id = req.params.id;

  Semester.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Semester was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Semester with id=${id}. Maybe Semester was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Semester with id=" + id
      });
    });
};

// Delete all Semesters
exports.deleteAll = (req, res) => {
  Semester.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Semesters were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all semesters."
      });
    });
};