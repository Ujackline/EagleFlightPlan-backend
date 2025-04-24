const db = require("../models"); // importing the database in order to access it in our code
const Student = db.Student; // picks/selects the student table in the database so we can use it 
const Op = db.Sequelize.Op; // gives us access to operators for specific search purposes (genre pour kugabanya search ushatse umuntu)
const FlightPlan = db.FlightPlan;


exports.create = async (req, res) => {
  if (!req.body.fName) {
    return res.status(400).send({ message: "Name cannot be empty!" });
  }

  const studentData = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
   // email: req.body.email,
    // studentID: req.body.studentID,
    major: req.body.major,
    semester: req.body.semester,
    grad_semester: req.body.grad_semester,
    cliftonstrengths: req.body.cliftonstrengths,
    flightPlanId: req.body.flightPlanId,
    points: req.body.points,
  };

  try {
    // 1. Create the student
    const student = await Student.create(studentData);

    // 2. Create a default FlightPlan for the student
    const flightPlan = await FlightPlan.create({
      name: `Flight Plan - ${student.semester}`,
      semester: student.semester,
      grad_semester: student.grad_semester,
      studentId: student.id,
    });

    return res.status(201).json({
      message: "Student profile and FlightPlan created",
      student,
      flightPlan,
    });
  } catch (err) {
    console.error("Error creating student and flight plan:", err);
    return res.status(500).send({
      message: "Error creating student or flight plan",
      error: err.message,
    });
  }
};

    flightPlanId: req.body.flightPlanId,
     points: req.body.points,
  };
  
  Student.create(student)
    .then(data => res.status(201).json({ message: "Student profile created", data }))
    .catch(err => res.status(500).send({ message: "Error creating student", error: err }));

    // id: req.body.id,
    // studentFirstName: req.body.studentFirstName,
    // studentLastName: req.body.studentLastName,
    // studentEmail: req.body.studentEmail,
    // studentSchoolID: req.body.studentSchoolID,
    // studentGradDate: req.body.studentGradDate, 
    // studentMajor: req.body.studentMajor,
    // studentCliftonStrengths: req.body.studentCliftonStrengths,
    // studentAwards: req.body.studentAwards,
    // studentPointsAwarded: req.body.studentPointsAwarded,
    // studentPointsUsed: req.body.studentPointsUsed,
    // studentPointsAvailable: req.body.studentPointsAvailable,
    // studentBadges: req.body.studentBadges,

}

// exports.findAll = (req, res) => {
//      const id = req.params.id;
//     Student.findAll({where: {id: id}})
//         .then((data) => {
//         if (data) {
//           res.send(data);
//         } else {
//           res.status(404).send({
//             message: `Cannot find Student for student with id=${id}.`,
//           });
//         }
//         })
//       .catch((err) => {
//         res.status(500).send({message:err.message ||"Error retrieving Projects for student with id=" 
//         });
//     });
// };

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

// controllers/studentController.js
exports.getLeaderboard = async (req, res) => {
  try {
    const students = await db.Student.findAll({
      attributes: ['id', 'fName', 'lName', 'points'],
      order: [['points', 'DESC']]
    });
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
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