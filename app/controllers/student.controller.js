const db = require("../models");
const Student = db.Student;
const Op = db.Sequelize.Op;

// ✅ Create a new student
exports.create = (req, res) => {
  if (!req.body.fName) {
    return res.status(400).send({ message: "First name cannot be empty!" });
  }

  const student = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    studentID: req.body.studentID,
    major: req.body.major,
    grad_semester: req.body.grad_semester,
    cliftonstrengths: req.body.cliftonstrengths,
    flightPlanId: req.body.flightPlanId,
    points: req.body.points,
  };

  Student.create(student)
    .then(data => res.status(201).json({ message: "Student profile created", data }))
    .catch(err => res.status(500).send({ message: "Error creating student", error: err }));
};

// ✅ Get all students
exports.findAll = (req, res) => {
  console.log("📥 Incoming request to fetch all students");

  Student.findAll()
    .then(data => {
      console.log("✅ Students retrieved:", data.length);
      res.json(data);
    })
    .catch(err => {
      console.error("❌ Error fetching students:", err);
      res.status(500).send({
        message: err.message || "Error retrieving students.",
      });
    });
};

// ✅ Get a student by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findByPk(id)
    .then(data => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).send({ message: `Student with ID ${id} not found.` });
      }
    })
    .catch(err => {
      console.error("❌ Error retrieving student:", err);
      res.status(500).send({ message: "Error retrieving student with ID " + id });
    });
};

// ✅ Update a student by ID
exports.update = (req, res) => {
  const id = req.params.id;

  Student.update(req.body, {
    where: { id: id },
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Student was updated successfully." });
      } else {
        res.status(404).send({ message: `Cannot update student with ID=${id}. Maybe student not found or body is empty.` });
      }
    })
    .catch(err => {
      console.error("❌ Error updating student:", err);
      res.status(500).send({ message: "Error updating student with ID " + id });
    });
};

// ✅ Delete a student by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Student.destroy({
    where: { id: id },
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Student was deleted successfully!" });
      } else {
        res.status(404).send({ message: `Cannot delete student with ID=${id}. Maybe student not found.` });
      }
    })
    .catch(err => {
      console.error("❌ Error deleting student:", err);
      res.status(500).send({ message: "Could not delete student with ID=" + id });
    });
};

// ✅ Delete all students
exports.deleteAll = (req, res) => {
  Student.destroy({
    where: {},
    truncate: false,
  })
    .then(nums => {
      res.send({ message: `${nums} students were deleted successfully!` });
    })
    .catch(err => {
      console.error("❌ Error deleting all students:", err);
      res.status(500).send({ message: err.message || "Error occurred while deleting all students." });
    });
};
