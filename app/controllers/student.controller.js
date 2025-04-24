const db = require("../models");
const Student = db.Student;
const User = db.User;
const Op = db.Sequelize.Op;
const FlightPlan = db.FlightPlan;

// Create a new student
exports.create = async (req, res) => {
  try {
    console.log("Received student creation request:", JSON.stringify(req.body, null, 2));

    // Find the user associated with the email
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      return res.status(400).send({
        message: "No user found with this email",
        email: req.body.email
      });
    }

    // Check if a student already exists for this user
    const existingStudent = await Student.findOne({
      where: { 
        [Op.or]: [
          { userId: user.id },
          { email: req.body.email },
          { studentID: req.body.studentID }
        ]
      }
    });

    if (existingStudent) {
      return res.status(400).send({
        message: "A student profile already exists for this user",
        existingStudent: {
          id: existingStudent.id,
          email: existingStudent.email,
          studentID: existingStudent.studentID
        }
      });
    }

    // Prepare student data using string semesters directly
    const studentData = {
      fName: req.body.fName.trim(),
      lName: req.body.lName.trim(),
      studentID: req.body.studentID.trim(),
      email: req.body.email.trim(),
      major: req.body.major.trim(),
      semester: req.body.semester.trim(),
      grad_semester: req.body.grad_semester.trim(),
      cliftonstrengths: req.body.cliftonstrengths.trim(),
      userId: user.id,
      points: 0
    };

    // Create student record
    const student = await Student.create(studentData);

    return res.status(201).json({
      message: "Student profile created successfully",
      student,
      userAssociated: true
    });

  } catch (error) {
    console.error("Error in student creation:", error);
    return res.status(500).send({
      message: "Unexpected error processing student profile",
      error: error.message
    });
  }
};

// Get all students
exports.findAll = (req, res) => {
  Student.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving students."
      });
    });
};

// Get student by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find student with id=${id}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving student with id=" + id
      });
    });
};

// Get student by userId
exports.findByUserId = (req, res) => {
  const userId = req.params.userId;

  Student.findOne({ where: { userId: userId } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find student with userId=${userId}.`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving student with userId=" + userId
      });
    });
};

// Update student
exports.update = (req, res) => {
  const id = req.params.id;

  Student.update(req.body, {
    where: { id: id }
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Student was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating student with id=" + id
      });
    });
};
exports.updatePoints = async (req, res) => {
  try {
    const id = req.params.id;
    const { points } = req.body;

    if (points === undefined) {
      return res.status(400).send({
        message: "Points value is required"
      });
    }

    const student = await db.Student.findByPk(id);
    if (!student) {
      return res.status(404).send({
        message: "Student not found"
      });
    }

    // Update points
    student.points = points;
    await student.save();

    res.status(200).send({
      message: "Points updated successfully",
      points: student.points
    });
  } catch (error) {
    console.error("Error updating student points:", error);
    res.status(500).send({
      message: "Error updating student points",
      error: error.message
    });
  }
};

// Delete student
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  try {
    await Student.destroy({ where: { id: id } });
    res.send({ message: "Student was deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete student with id=" + id,
      error: err.message
    });
  }
};

// Delete all students
exports.deleteAll = (req, res) => {
  Student.destroy({
    where: {},
    truncate: false
  })
    .then((nums) => {
      res.send({ message: `${nums} Students were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all students."
      });
    });
};


// Get student's points
exports.getPoints = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  res.json({ points: student.points });
};

// Add points to student
exports.addPoints = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  student.points += amount;
  await student.save();

  res.json({ message: 'Points added', points: student.points });
};

// Redeem points from student
exports.redeemPoints = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  if (student.points < amount) {
    return res.status(400).json({ error: 'Not enough points' });
  }

  student.points -= amount;
  await student.save();

  res.json({ message: 'Points redeemed', points: student.points });
};

// Get current logged-in student
exports.getCurrentStudent = (req, res) => {
  if (!req.user) {
    return res.status(401).send({
      message: "No authentication found"
    });
  }
  
  Student.findOne({ where: { userId: req.user.id } })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Current user not found in database"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving current user"
      });
    });
};