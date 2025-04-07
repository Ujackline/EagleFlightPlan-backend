// const db = require("../models");
// const Task = db.Task;
// const Op = db.Sequelize.Op;


// // Create and Save a new Task
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.taskName) {
//     console.log(req.body);
//     return res.status(400).send({ message: "Job title, company, start date, and resume ID are required!" });
//   }


//   // Create an Task object
//   const task = {
//     category: req.body.category,
//     id: req.body.id,
//     taskName: req.body.taskName,
//     description: req.body.description,
//     NumOfPoints: req.body.NumOfPoints,
//     Rationale: req.body.Rationale,
//     grad_semester: req.body.grad_semester,
//     scheduling_type: req.body.scheduling_type,
//     reflection_required: req.body.reflection_required,
//     //resumeId: req.body.resumeId,
//     majors: req.body.majors, // Fixed spelling
//     CliftonStrengths: req.body.CliftonStrengths
//   };


//   // Save Task in the database
//   Task.create(task)
//     .then(data => res.send(data))
//     .catch(err => {
//       console.error("Error creating Task:", err);
//       console.log(task);
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Task."
//       });
//     });
// };
// // continue ici
// // Retrieve all Task entries for a specific Resume
// // exports.findAll = (req, res) => {
// //   const id = req.params.id;
// //   Task.findAll({ where: { id: id } })
// //     .then(data => res.send(data))
// //     .catch(err => {
// //       console.error("Error retrieving Task:", err);
// //       res.status(500).send({
// //         message: err.message || "Error retrieving Task."
// //       });
// //     });
// // };


// // exports.findAll = (req, res) => {
// //   const id = req.params.id || req.query.id || req.body.id;


// //   if (!id) {
// //     return res.status(400).send({ message: "ID parameter is missing." });
// //   }


// //   Task.findAll({ where: { resumeId: id } }) // Use the correct field
// //     .then(data => res.send(data))
// //     .catch(err => {
// //       console.error("Error retrieving Task:", err);
// //       res.status(500).send({
// //         message: err.message || "Error retrieving Task."
// //       });
// //     });
// // };
// exports.findAll = (req, res) => {
//   Task.findAll()  // No filtering by ID
//     .then(data => res.send(data))
//     .catch(err => {
//       console.error("Error retrieving tasks:", err);
//       res.status(500).send({
//         message: err.message || "Error retrieving tasks."
//       });
//     });
// };






// // Find a single Task with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Task.findByPk(id)
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({ message: `Cannot find Task with id=${id}.` });
//       }
//     })
//     .catch(err => {
//       console.error("Error retrieving Task with id:", id, err);
//       res.status(500).send({
//         message: err.message || `Error retrieving Task with id=${id}`
//       });
//     });
// };


// // Update an Task by the id in the request
// exports.update = (req, res) => {
//   const id = req.params.id;


//   // Validate request
//   if (!req.body.id) {
//     return res.status(400).send({
//       success: false,
//       message: "task ID required for updating!"
//     });
//   }


//   Task.update(req.body, { where: { id: id } })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           success: true,
//           message: "Task was updated successfully."
//         });
//       } else {
//         res.status(404).send({
//           success: false,
//           message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       console.error("Error updating Task with id:", id, err);
//       res.status(500).send({
//         success: false,
//         message: err.message || `Error updating Task with id=${id}`
//       });
//     });
// };


// // Delete an Task with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Task.destroy({ where: { id: id } })
//     .then(num => {
//       if (num == 1) {
//         res.send({ message: "Task was deleted successfully!" });
//       } else {
//         res.status(404).send({
//           message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       console.error("Error deleting Task with id:", id, err);
//       res.status(500).send({
//         message: err.message || `Could not delete Task with id=${id}`
//       });
//     });
// };

// exports.completeTask = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const task = await Task.findByPk(id);

//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     if (!task.completed) {
//       task.completed = true;
//       task.points += 3; // Increment points by 3
//       await task.save();
//     }

//     res.json({ message: "Task marked as completed!", task });
//   } catch (error) {
//     console.error("Error completing task:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



// // Delete all Task entries from the database.
// exports.deleteAll = (req, res) => {
//   Task.destroy({ where: {}, truncate: false })
//     .then(nums => res.send({ message: `${nums} Task entries were deleted successfully!` }))
//     .catch(err => {
//       console.error("Error removing all Task entries:", err);
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all Task entries."
//       });
//     });
// };

const db = require("../models");
 const Task = db.Task;
 const Op = db.Sequelize.Op;
 
 
 // Create and Save a new Task
 exports.create = (req, res) => {
   // Validate request
   if (!req.body.taskName) {
     console.log(req.body);
     return res.status(400).send({ message: "Job title, company, start date, and resume ID are required!" });
   }
 
 
   // Create an Task object
   const task = {
     category: req.body.category,
     // id: req.body.id,
     taskName: req.body.taskName,
     description: req.body.description,
     NumOfPoints: req.body.NumOfPoints,
     // Rationale: req.body.Rationale,
     grad_semester: req.body.grad_semester,
    // scheduling_type: req.body.scheduling_type,
    // reflection_required: req.body.reflection_required,
     //resumeId: req.body.resumeId,
     majors: req.body.majors, // Fixed spelling
     CliftonStrengths: req.body.CliftonStrengths
   };
 
 
   // Save Task in the database
   Task.create(task)
     .then(data => res.send(data))
     .catch(err => {
       console.error("Error creating Task:", err);
       console.log(task);
       res.status(500).send({
         message: err.message || "Some error occurred while creating the Task."
       });
     });
 };
 // continue ici
 // Retrieve all Task entries for a specific Resume
 // exports.findAll = (req, res) => {
 //   const id = req.params.id;
 //   Task.findAll({ where: { id: id } })
 //     .then(data => res.send(data))
 //     .catch(err => {
 //       console.error("Error retrieving Task:", err);
 //       res.status(500).send({
 //         message: err.message || "Error retrieving Task."
 //       });
 //     });
 // };
 
 
 // exports.findAll = (req, res) => {
 //   const id = req.params.id || req.query.id || req.body.id;
 
 
 //   if (!id) {
 //     return res.status(400).send({ message: "ID parameter is missing." });
 //   }
 
 
 //   Task.findAll({ where: { resumeId: id } }) // Use the correct field
 //     .then(data => res.send(data))
 //     .catch(err => {
 //       console.error("Error retrieving Task:", err);
 //       res.status(500).send({
 //         message: err.message || "Error retrieving Task."
 //       });
 //     });
 // };
//  exports.findAll = (req, res) => {
//    Task.findAll()  // No filtering by ID
//      .then(data => res.send(data))
//      .catch(err => {
//        console.error("Error retrieving tasks:", err);
//        res.status(500).send({
//          message: err.message || "Error retrieving tasks."
//        });
//      });
//  };
exports.findAll = (req, res) => {
  Task.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Error retrieving tasks:", err);
      if (!res.headersSent) { // Ensure we haven't already sent a response
        return res.status(500).send({
          message: err.message || "Error retrieving tasks."
        });
      }
    });
};

 
 
 
 
 
 
 // Find a single Task with an id
 exports.findOne = (req, res) => {
   const id = req.params.id;
   Task.findByPk(id)
     .then(data => {
       if (data) {
         res.send(data);
       } else {
         res.status(404).send({ message: `Cannot find Task with id=${id}.` });
       }
     })
     .catch(err => {
       console.error("Error retrieving Task with id:", id, err);
       res.status(500).send({
         message: err.message || `Error retrieving Task with id=${id}`
       });
     });
 };
 
 
 // Update an Task by the id in the request
 exports.update = (req, res) => {
   const id = req.params.id;
 
 
   // Validate request
   if (!req.body.id) {
     return res.status(400).send({
       success: false,
       message: "task ID required for updating!"
     });
   }
 
 
   Task.update(req.body, { where: { id: id } })
     .then(num => {
       if (num == 1) {
         res.send({
           success: true,
           message: "Task was updated successfully."
         });
       } else {
         res.status(404).send({
           success: false,
           message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
         });
       }
     })
     .catch(err => {
       console.error("Error updating Task with id:", id, err);
       res.status(500).send({
         success: false,
         message: err.message || `Error updating Task with id=${id}`
       });
     });
 };
 
 exports.completeTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!task.completed) {
      task.completed = true;
      task.NumOfPoints += 3; // Increment points by 3
      await task.save();
    }

    res.json({ message: "Task marked as completed!", task });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 // Delete an Task with the specified id in the request
 exports.delete = (req, res) => {
   const id = req.params.id;
   Task.destroy({ where: { id: id } })
     .then(num => {
       if (num == 1) {
         res.send({ message: "Task was deleted successfully!" });
       } else {
         res.status(404).send({
           message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
         });
       }
     })
     .catch(err => {
       console.error("Error deleting Task with id:", id, err);
       res.status(500).send({
         message: err.message || `Could not delete Task with id=${id}`
       });
     });
 };
 
 
 // Delete all Task entries from the database.
 exports.deleteAll = (req, res) => {
   Task.destroy({ where: {}, truncate: false })
     .then(nums => res.send({ message: `${nums} Task entries were deleted successfully!` }))
     .catch(err => {
       console.error("Error removing all Task entries:", err);
       res.status(500).send({
         message: err.message || "Some error occurred while removing all Task entries."
       });
     });
 };