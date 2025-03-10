const db = require("../models"); // Import models
const Badge = db.Badge; // Get Awards model
const Op = db.Sequelize.Op; // Sequelize operators for queries

// **1. Create a new Award**
exports.create = (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.points || !req.body.redemption_type) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  const badge = {
    name: req.body.name,
    id:req.body.id,
    description: req.body.description,
    points: req.body.points,
    badge_type: req.body.badge_type,
    
  };

  Badge.create(badge)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while creating the badge." })
    );
};

// **2. Retrieve all Awards**
exports.findAll = (req, res) => {
  Badge.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving badges." })
    );
};

// **3. Retrieve an Award by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  Badge.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find Badge with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving Badge with id=" + id })
    );
};



// **5. Update a badge**
exports.update = (req, res) => {
  const id = req.params.id;

  Badge.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "a badge was updated successfully." });
      else res.send({ message: `Cannot update a badge with id=${id}. Maybe a badge was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating a badge with id=" + id })
    );
};

// **6. Delete an a badge**
exports.delete = (req, res) => {
  const id = req.params.id;

  Award.destroy({ where: { id: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Award was deleted successfully!" });
      else res.send({ message: `Cannot delete Award with id=${id}. Maybe Award was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete Award with id=" + id })
    );
};

// **7. Delete all badges**
exports.deleteAll = (req, res) => {
  Badge.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} Awards were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all Awards." })
    );
};
