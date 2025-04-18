const db = require("../models");
const Semester = db.Semester;
const { Op } = db.Sequelize;


exports.validateId = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid semester ID format" });
  }
  next();
};

// Validate semester creation data
exports.validateCreate = (req, res, next) => {
  const requiredFields = ['name', 'code', 'start_date', 'end_date', 'academic_year'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }
  
  // Additional validation logic here
  if (new Date(req.body.end_date) <= new Date(req.body.start_date)) {
    return res.status(400).json({ 
      message: "End date must be after start date" 
    });
  }
  
  next();
};

// Create semester (now with validation)
exports.create = [
  this.validateCreate,
  async (req, res) => {
    try {
      const semester = await Semester.create(req.body);
      res.status(201).json(semester);
    } catch (error) {
      res.status(500).json({ 
        message: error.message || "Error creating semester",
        errors: error.errors 
      });
    }
  }
];

exports.findAll = (req, res) => {
  Semester.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving semesters."
      });
    });
};

// exports.findOne = async (req, res) => {
//   try {
//     const semester = await Semester.findByPk(req.params.id, {
//       include: [
//         { 
//           model: db.FlightPlan,
//           as: 'flightPlans',
//           attributes: ['id', 'name']
//         },
//         {
//           model: db.Student,
//           as: 'enrolledStudents',
//           attributes: ['id', 'fName', 'lName', 'email']
//         }
//       ]
//     });
    
//     if (!semester) {
//       return res.status(404).json({ message: "Semester not found" });
//     }
    
//     res.json(semester);
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving semester" });
//   }
// };

exports.findOne = (req, res) => {
  const id = req.params.id;

  Semester.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Semester with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving Semester with id=" + id
      });
    });
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Semester.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updated) {
      const semester = await Semester.findByPk(req.params.id);
      return res.json(semester);
    }
    
    res.status(404).json({ message: "Semester not found" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating semester",
      errors: error.errors 
    });
  }
};

exports.setActive = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      await Semester.update(
        { is_active: false },
        { where: {}, transaction: t }
      );
      
      const [updated] = await Semester.update(
        { is_active: true },
        { 
          where: { id: req.params.id },
          transaction: t 
        }
      );
      
      if (!updated) {
        throw new Error("Semester not found");
      }
    });
    
    res.json({ message: "Semester activated successfully" });
  } catch (error) {
    res.status(error.message === "Semester not found" ? 404 : 500).json({
      message: error.message || "Error activating semester"
    });
  }
};
exports.findActive = (req, res) => {
  Semester.findOne({
    where: { is_active: true }
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "No active semester found"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving active semester"
      });
    });
};
exports.delete = async (req, res) => {
  try {
    const deleted = await Semester.destroy({
      where: { id: req.params.id }
    });
    
    if (deleted) {
      return res.json({ message: "Semester deleted successfully" });
    }
    
    res.status(404).json({ message: "Semester not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting semester" });
  }
};