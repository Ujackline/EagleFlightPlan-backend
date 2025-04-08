const db = require("../models");
const Student = db.Student;
const Op = db.Sequelize.Op;
const FlightPlan = db.FlightPlan;
const Semester = db.Semester;

exports.create = async (req, res) => {
  if (!req.body.fName) {
    return res.status(400).send({ message: "Name cannot be empty!" });
  }

  try {
    // Find semester IDs based on semester names
    const currentSemester = await Semester.findOne({
      where: { name: req.body.semester }
    });

    const gradSemester = await Semester.findOne({
      where: { name: req.body.grad_semester }
    });

    const studentData = {
      id: req.body.id,
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      studentID: req.body.studentID,
      major: req.body.major,
      currentSemesterId: currentSemester ? currentSemester.id : null,
      gradSemesterId: gradSemester ? gradSemester.id : null,
      cliftonstrengths: req.body.cliftonstrengths,
      points: req.body.points || 0
    };

    // 1. Create the student
    const student = await Student.create(studentData);

    // 2. Create a default FlightPlan for the student
    const flightPlan = await FlightPlan.create({
      name: `Flight Plan - ${req.body.semester}`,
      semester: req.body.semester,
      grad_semester: req.body.grad_semester,
      studentId: student.id,
    });

    return res.status(201).json({
      message: "Student profile and FlightPlan created",
      student,
      flightPlan,
    });
  } catch (err) {
    console.error("Detailed error creating student:", {
      message: err.message,
      name: err.name,
      errors: err.errors // Sequelize validation errors
    });

    return res.status(500).send({
      message: "Error creating student or flight plan",
      error: err.message,
      details: err.errors
    });
  }
};


exports.findAll = (req, res) => {
    const id = req.params.id;
    Student.findAll({where: {id: id}})
        .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Student for student with id=${id}.`,
          });
        }
        })
      .catch((err) => {
        res.status(500).send({message:err.message ||"Error retrieving Projects for student with id=" 
        });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find student with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving student with id=" + id,
      });
    });
};

// exports.findByEmail = (req, res) => {
//   const studentEmail = req.params.studentEmail;

//   Student.findOne({
//     where: {
//       studentEmail: studentEmail,
//     },
//   })
//     .then((data) => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.send({ studentEmail: "not found" });
//         /*res.status(404).send({
//           message: `Cannot find student with email=${email}.`
//         });*/
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving student with email=" + studentEmail,
//       });
//     });
// };

exports.update = (req, res) => {
  const id = req.params.id;

  Student.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "student was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update student with id=${id}. Maybe student was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating student with id=" + id,
      });
    });
};


exports. getPoints = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  res.json({ points: student.points });
};

exports. addPoints = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const student = await Student.findByPk(id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  student.points += amount;
  await student.save();

  res.json({ message: 'Points added', points: student.points });
};

exports. redeemPoints = async (req, res) => {
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


// Get current logged-in student from session/token
exports.getCurrentStudent = (req, res) => {
  // Check if user is authenticated
  if (req.user) {
    // If user data is stored in req.user from your auth middleware
    Student.findByPk(req.user.id)
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
  } else {
    // If you're using JWT tokens stored in the request
    const token = req.headers["x-access-token"] || req.headers.authorization;
    
    if (!token) {
      return res.status(401).send({
        message: "No authentication token provided"
      });
    }
    
    try {
      // You'll need to implement this function based on your auth system
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      Student.findByPk(decoded.id)
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
    } catch (err) {
      return res.status(401).send({
        message: "Invalid or expired token"
      });
    }
  }
};
exports.delete = (req, res) => {
  const id = req.params.id;

  Student.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "student was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete student with id=${id}. Maybe student was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Student with id=" + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  Student.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Students were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};