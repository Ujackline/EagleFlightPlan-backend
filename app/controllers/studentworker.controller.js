const db = require("../models"); // importing the database in order to access it in our code
const StudentWorker = db.StudentWorker; // picks/selects the Admin table in the database so we can use it 
const Op = db.Sequelize.Op; // gives us access to operators for specific search purposes (genre pour kugabanya search ushatse umuntu)

// const  VALID_ROLES = ["Admin", "admin"]; 

// request & response; creates a Admin object
exports.create = (req,res) => {
    if(!req.body.fName){
        return res.status(400).send({message: "name cannot be empty!"}); 
    }

// maps these values to the Admin object
const studentworker = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    role: req.body.studentworker,

}; 

    StudentWorker.create(studentworker)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "some error occured while creating "}));
}

exports.findAll = (req, res) => {
    const id = req.params.id;
    StudentWorker.findAll({where: {id: id}})
        .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find studentworker for studentworker with id=${id}.`,
          });
        }
        })
      .catch((err) => {
        res.status(500).send({message:err.message ||"Error retrieving Projects for studentworker with id=" 
        });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Admin.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find studentworker with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentworker with id=" + id,
      });
    });
};

exports.findByEmail = (req, res) => {
  const email = req.params.email;

  StudentWorker.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ email: "not found" });
        /*res.status(404).send({
          message: `Cannot find admin with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving studentworker with email=" + email,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  StudentWorker.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "studentworker was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update studentworker with id=${id}. Maybe studentworker was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating studentworker with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  StudentWorker.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "studentworker was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete studentworker with id=${id}. Maybe admin was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete studentworker with id=" + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
    StudentWorker.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} studentworker were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};