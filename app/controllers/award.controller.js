const db = require("../models"); // Import models
const Award = db.Awards; // Get Awards model
const Op = db.Sequelize.Op; // Sequelize operators for queries

// **1. Create a new Award**
exports.create = (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.points || !req.body.redemption_type) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  const award = {
    name: req.body.name,
    id:req.body.id,
    description: req.body.description,
    points: req.body.points,
    redemption_type: req.body.redemption_type,
    redemption_info: req.body.redemption_info,
  };

  Award.create(award)
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while creating the Award." })
    );
};

// **2. Retrieve all Awards**
exports.findAll = (req, res) => {
  Award.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving Awards." })
    );
};

// **3. Retrieve an Award by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  Award.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find Award with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving Award with id=" + id })
    );
};

// **4. Retrieve Awards by Redemption Type**
exports.findByRedemptionType = (req, res) => {
  const redemption_type = req.params.redemption_type;

  Award.findAll({ where: { redemption_type: redemption_type } })
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving Awards for Redemption Type=" + redemption_type })
    );
};

// **5. Update an Award**
exports.update = (req, res) => {
  const id = req.params.id;

  Award.update(req.body, { where: { AwardID: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Award was updated successfully." });
      else res.send({ message: `Cannot update Award with id=${id}. Maybe Award was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating Award with id=" + id })
    );
};

// **6. Delete an Award**
exports.delete = (req, res) => {
  const id = req.params.id;

  Award.destroy({ where: { AwardID: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "Award was deleted successfully!" });
      else res.send({ message: `Cannot delete Award with id=${id}. Maybe Award was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete Award with id=" + id })
    );
};

// **7. Delete all Awards**
exports.deleteAll = (req, res) => {
  Award.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} Awards were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all Awards." })
    );
};
