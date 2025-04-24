const db = require("../models"); // Import models
const FlightPlan = db.FlightPlan; // Get FlightPlan model
const Op = db.Sequelize.Op; // Sequelize operators for queries

// **1. Create a new FlightPlan**
exports.create = (req, res) => {
  if (!req.body.name || !req.body.semester || !req.body.grad_semester || !req.body.studentId) {
    return res.status(400).send({ message: "Required fields cannot be empty!" });
  }

  const flightPlan = {
    name: req.body.name,
    semester: req.body.semester,
    grad_semester: req.body.grad_semester,
    studentId: req.body.studentId, // correct foreign key
  };

  FlightPlan.create(flightPlan)
    .then((data) => res.status(201).send(data))
    .catch((err) =>
      res.status(500).send({
        message: err.message || "Some error occurred while creating the FlightPlan.",
      })
    );
};


// **2. Retrieve all FlightPlans**
exports.findAll = (req, res) => {
  FlightPlan.findAll()
    .then((data) => res.send(data))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while retrieving FlightPlans." })
    );
};

// **3. Retrieve a FlightPlan by ID**
exports.findOne = (req, res) => {
  const id = req.params.id;

  FlightPlan.findByPk(id)
    .then((data) => {
      if (data) res.send(data);
      else res.status(404).send({ message: `Cannot find FlightPlan with id=${id}.` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error retrieving FlightPlan with id=" + id })
    );
};

exports.findByStudentAndSemester = async (req, res) => {
  const { studentId, semester } = req.params;

  try {
    const plan = await FlightPlan.findOne({
      where: {
        studentId,
        semester,
      },
      include: [
        {
          model: db.Experience,
          as: "experiences",
          where: { semester }, // Filter experiences by semester
          required: false,
        },
        {
          model: db.Task,
          as: "tasks",
          where: { semester }, // Filter tasks by semester
          required: false,
        },
        {
          model: db.Event,
          as: "events",
          where: { semester }, // Filter events by semester
          required: false,
        },
      ],
    });

    if (!plan) {
      return res.status(404).send({ message: "No flight plan found." });
    }

    res.send(plan);
  } catch (error) {
    console.error("Error fetching detailed flight plan:", error);
    res.status(500).send({ message: "Server error retrieving flight plan." });
  }
};



// **5. Update a FlightPlan**
exports.update = (req, res) => {
  const id = req.params.id;

  FlightPlan.update(req.body, { where: { FlightPlanID: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "FlightPlan was updated successfully." });
      else res.send({ message: `Cannot update FlightPlan with id=${id}. Maybe FlightPlan was not found or req.body is empty!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error updating FlightPlan with id=" + id })
    );
};

// **6. Delete a FlightPlan**
exports.delete = (req, res) => {
  const id = req.params.id;

  FlightPlan.destroy({ where: { FlightPlanID: id } })
    .then((num) => {
      if (num == 1) res.send({ message: "FlightPlan was deleted successfully!" });
      else res.send({ message: `Cannot delete FlightPlan with id=${id}. Maybe FlightPlan was not found!` });
    })
    .catch((err) =>
      res.status(500).send({ message: "Could not delete FlightPlan with id=" + id })
    );
};

// **7. Delete all FlightPlans**
exports.deleteAll = (req, res) => {
  FlightPlan.destroy({ where: {}, truncate: false })
    .then((nums) => res.send({ message: `${nums} FlightPlans were deleted successfully!` }))
    .catch((err) =>
      res.status(500).send({ message: err.message || "Some error occurred while removing all FlightPlans." })
    );
};
