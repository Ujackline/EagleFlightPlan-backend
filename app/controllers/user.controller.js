const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;

// Add this constant at the top of the file
const VALID_ROLES = ['student', 'admin'];

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.fName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Validate role
  const role = req.body.role || 'student';
  if (!VALID_ROLES.includes(role)) {
    res.status(400).send({
      message: "Invalid role. Role must be either 'student' or 'admin'",
    });
    return;
  }

  // Create a User
  const user = {
    id: req.body.id,
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    role: role,
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all People from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  const role = req.query.role;

  let condition = {};
  if (id) {
    condition.id = { [Op.like]: `%${id}%` };
  }
  if (role && VALID_ROLES.includes(role)) {
    condition.role = role;
  }

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving people.",
      });
    });
};

exports.isAdmin = (req, res, next) => {
  console.log("🔥 Checking if user is admin. Request User:", req.user);

  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized: User not found" });
  }

  const userId = req.user.id;

  User.findByPk(userId)
    .then(user => {
      console.log("🔍 Found User:", user);

      if (!user) {
        console.log("❌ User not found in database.");
        return res.status(401).send({ message: "Unauthorized: User not found in database" });
      }

      if (user.role !== 'admin') {
        console.log("🚫 Access Denied: User is not an admin.");
        return res.status(403).send({ message: "Require Admin Role!" });
      }

      console.log("✅ User is an admin. Proceeding...");
      next(); // Move to `notification.findAll`
    })
    .catch(err => {
      console.error("❌ Error checking admin status:", err);
      res.status(500).send({ message: "Error checking admin status" });
    });
};


exports.findAllAdmins = (req, res) => {
  User.findAll({
    where: {
      role: 'admin'
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving admins"
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single User with an email
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({
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
          message: `Cannot find User with email=${email}.`
        });*/
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// Delete all People from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all people.",
      });
    });
};

// Add new method to check if user is a student
exports.isStudent = (req, res, next) => {
  const userId = req.user.id;

  User.findByPk(userId)
    .then(user => {
      if (!user || user.role !== 'student') {
        return res.status(403).send({
          message: "Require Student Role!"
        });
      }
      next();
      return null;
    })
    .catch(err => {
      res.status(500).send({
        message: "Error checking student status"
      });
    });
};
