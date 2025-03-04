const db = require("../models"); // Import models
const Experience = db.Experience; // Get Experiences model
const Op = db.Sequelize.Op; // Sequelize operators for queries

// **1. Create a new Experience**
exports.create = (req, res) => {
  if (!req.body.name || !req.body.category || !req.body.description || !req.body.type) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  const experience = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    type: req.body.type,
    // Reflection_required: req.body.Reflection_required,
    // Scheduling_type: req.body.scheduling_type,
    // Rational: req.body.rational,
    badge: req.body.badge,
    major: req.body.major,
    cliftonStrength: req.body.cliftonStrength,
  };

  Experience.create(experience)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while creating the Experience." })
    );
};

// **2. Retrieve all Experiences**
exports.findAll = (req, res) => {
  Experience.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving Experiences." })
    );
};

// **3. Retrieve an Experience by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  Experience.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find Experience with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving Experience with id=" + id })
    );
};

// // **4. Retrieve Experiences by Category**
// exports.findByCategory = (req, res) => {
//   const category = req.params.category;

//   Experience.findAll({ where: { Category: category } })
//     .then((data) => res.send(data))
//     .catch((err) =>
//       res.status(500).send({ message: "Error retrieving Experiences for Category=" + category })
//     );
// };

// **5. Update an Experience**
exports.update = (req, res) => {
  const id = req.params.id;

  Experience.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Experience was updated successfully." });
      else res.send({ message: `Cannot update Experience with id=${id}. Maybe Experience was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating Experience with id=" + id })
    );
};

// **6. Delete an Experience**
exports.delete = (req, res) => {
  const id = req.params.id;

  Experience.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Experience was deleted successfully!" });
      else res.send({ message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete Experience with id=" + id })
    );
};

// **7. Delete all Experiences**
exports.deleteAll = (req, res) => {
  Experience.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} Experiences were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all Experiences." })
    );
};
