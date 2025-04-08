const db = require("../models"); // importing the database in order to access it in our code
const Student = db.Student; // picks/selects the student table in the database so we can use it 
const Op = db.Sequelize.Op; // gives us access to operators for specific search purposes (genre pour kugabanya search ushatse umuntu)

// const  VALID_ROLES = ["student", "admin"]; 

// request & response; creates a student object
exports.create = (req,res) => {
    if(!req.body.fName){
        return res.status(400).send({message: "name cannot be empty!"}); 
    }

// maps these values to the student object
const student = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
   // email: req.body.email,
    // studentID: req.body.studentID,
    major: req.body.major,
    grad_semester: req.body.grad_semester,
    cliftonstrengths: req.body.cliftonstrengths,
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