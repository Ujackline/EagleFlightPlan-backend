const db = require("../models"); // Import database models
const Admin = db.Admin; // Reference the Admin model
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");

// ✅ 1️⃣ Create an Admin with Role Validation
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

// ✅ 2️⃣ Find All Admins
exports.findAll = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.send(admins);
  } catch (error) {
    console.error("Error retrieving admins:", error);
    res.status(500).send({ message: "Error retrieving all admins." });
  }
};

// ✅ 3️⃣ Find an Admin by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
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

// ✅ 4️⃣ Find an Admin by Email (Used for Google Login)
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

// ✅ 5️⃣ Update an Admin (Only Admins Can Change Roles)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent role changes unless requester is an admin
    if (role && req.user.role !== "admin") {
      return res.status(403).send({ message: "Access denied! Only admins can change roles." });
    }

    const [updated] = await Admin.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "Admin was updated successfully." });
    } else {
      res.status(404).send({ message: `Cannot update admin with id=${id}. Maybe admin was not found.` });
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).send({ message: "Error updating admin." });
  }
};

// ✅ 6️⃣ Delete an Admin (Only Admins Can Delete Other Admins)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the admin
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found." });
    }

    // Prevent deleting another admin unless user is an admin
    if (admin.role === "admin" && req.user.role !== "admin") {
      return res.status(403).send({ message: "Access denied! Only admins can delete other admins." });
    }

    await Admin.destroy({ where: { id } });
    res.send({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send({ message: "Could not delete admin." });
  }
};

// ✅ 7️⃣ Delete All Admins (Only Admins Can Delete All)
exports.deleteAll = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Access denied! Only admins can delete all admins." });
    }

    const deleted = await Admin.destroy({ where: {}, truncate: false });
    res.send({ message: `${deleted} Admins were deleted successfully!` });
  } catch (error) {
    console.error("Error deleting admins:", error);
    res.status(500).send({ message: "Error deleting all admins." });
  }
};
