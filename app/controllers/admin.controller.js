const { admin } = require("googleapis/build/src/apis/admin");
const db = require("../models"); // Import database models
const Admin = db.Admin; // Reference the Admin model
const User = db.User;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const Notification = db.Notification; // Assuming notifications are stored in a table


//  Create an Admin with Role Validation
exports.create = async (req, res) => {
  try {
    const { fName, lName, email, role } = req.body;

    // Ensure role is one of the allowed values
    const validRoles = ["admin", "student", "student_worker"];
    const assignedRole = role || "student"; // Default role is student

    if (!validRoles.includes(assignedRole)) {
      return res.status(400).send({ message: "Invalid role specified!" });
    }

    // Ensure email is unique
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).send({ message: "Email already in use!" });
    }

    // Create new admin user
    const newAdmin = await Admin.create({
      fName,
      lName,
      email,
      role: assignedRole,
    });

    res.status(201).send(newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).send({ message: "Some error occurred while creating admin." });
  }
};

//  Find All Admins
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['userId', 'fName', 'lName', 'email', 'role', 'isAdmin'],
      order: [['createdAt', 'DESC']]
    });
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  }
};

// Matches updateUserRole(userId, role) in adminServices.js
exports.updateUserRole = async (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body;

  if (!role || !['admin', 'student'].includes(role)) {
    return res.status(400).send({
      message: "Role must be either 'admin' or 'student'"
    });
  }

  try {
    const result = await User.update(
      {
        role: role,
        isAdmin: role === 'admin'
      },
      { where: { id: userId } }
    );

    if (result[0] === 1) {
      res.send({
        message: "User role was updated successfully."
      });
    } else {
      res.status(404).send({
        message: `Cannot update role for user with id=${userId}. User not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating user role with id=" + userId
    });
  }
};



//  Find an Admin by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.user;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).send({ message: "Admin not found." });
    }

    res.send(admin);
  } catch (error) {
    console.error("Error retrieving admin:", error);
    res.status(500).send({ message: "Error retrieving admin." });
  }
};

exports.getAdminInfo = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // 🔍 Fetch full admin details from DB
    const admin = await Admin.findOne({ where: { id: req.user.id } });

    if (!admin) {
      return res.status(404).json({ message: "Admin record not found in the database." });
    }

    res.status(200).json({
      id: admin.id,
      fName: admin.fName,
      lName: admin.lName,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("❌ Error fetching admin info:", error);
    res.status(500).json({ message: "Error fetching admin info", error });
  }
};



exports.getNotifications = async (req, res) => {
  try {
    console.log("JAckie");

    console.log(req.user, req.user.id);

    const notifications = await Notification.findAll({
      where: { recipientId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Find an Admin by Email (Used for Google Login)
exports.findByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).send({ message: "Admin not found." });
    }

    // Return admin details including role for frontend navigation
    res.send({
      id: admin.id,
      fName: admin.fName,
      lName: admin.lName,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error retrieving admin:", error);
    res.status(500).send({ message: "Error retrieving admin by email." });
  }
};

// Matches deleteUser(userId) in adminServices.js
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await User.destroy({
      where: { id: userId }
    });

    if (result === 1) {
      res.send({ message: "User was deleted successfully!" });
    } else {
      res.status(404).send({
        message: `Cannot delete User with id=${userId}. Maybe User was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete User with id=" + userId
    });
  }
};
