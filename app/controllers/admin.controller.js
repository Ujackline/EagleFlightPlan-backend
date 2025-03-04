const db = require("../models"); // importing the database in order to access it in our code
const Admin = db.admin; // picks/selects the Admin table in the database so we can use it 
const Op = db.Sequelize.Op; // gives us access to operators for specific search purposes (genre pour kugabanya search ushatse umuntu)

// const  VALID_ROLES = ["Admin", "admin"]; 

// request & response; creates a Admin object
exports.create = (req,res) => {
    if(!req.body.adminFirstName){
        return res.status(400).send({message: "name cannot be empty!"}); 
    }

// maps these values to the Admin object
const admin = {
    id: req.body.id,
    adminFirstName: req.body.adminFirstName,
    adminLastName: req.body.adminLastName,
    adminEmail: req.body.adminEmail,
    adminRole: req.body.adminRole,

}; 

    Admin.create(admin)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "some error occured while creating "}));
}

exports.findAllForAdmin = (req, res) => {
    const id = req.params.id;
    Admin.findAll({where: {id: id}})
        .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Admin for admin with id=${id}.`,
          });
        }
        })
      .catch((err) => {
        res.status(500).send({message:err.message ||"Error retrieving Projects for admin with id=" 
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
          message: `Cannot find admin with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving admin with id=" + id,
      });
    });
};

exports.findByEmail = (req, res) => {
  const adminEmail = req.params.adminEmail;

  Admin.findOne({
    where: {
      adminEmail: adminEmail,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ adminEmail: "not found" });
        /*res.status(404).send({
          message: `Cannot find admin with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving admin with email=" + adminEmail,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Admin.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "admin was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update admin with id=${id}. Maybe admin was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating admin with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Admin.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "admin was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete admin with id=${id}. Maybe admin was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Admin with id=" + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  Admin.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Admin were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};