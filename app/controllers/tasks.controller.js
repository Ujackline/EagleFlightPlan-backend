// const db = require("../models");
// const Task = db.Task;
// const Op = db.Sequelize.Op;

// // Create and Save a new Experience
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.taskName) {
//     console.log(req.body);
//     return res.status(400).send({ message: "Job title, company, start date, and resume ID are required!" });
//   }

//   // Create an Experience object
//   const tasks = {
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

//   // Save Experience in the database
//   Task.create(task)
//     .then(data => res.send(data))
//     .catch(err => {
//       console.error("Error creating Experience:", err);
//       console.log(task);
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Experience."
//       });
//     });
// };
// // continue ici
// // Retrieve all Experience entries for a specific Resume
// exports.findAllForUser = (req, res) => {
//   const id = req.params.id;
//   Experience.findAll({ where: { user_id: id } })
//     .then(data => res.send(data))
//     .catch(err => {
//       console.error("Error retrieving Experience:", err);
//       res.status(500).send({
//         message: err.message || "Error retrieving Experience."
//       });
//     });
// };

// // Find a single Experience with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Task.findByPk(id)
//     .then(data => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({ message: `Cannot find Experience with id=${id}.` });
//       }
//     })
//     .catch(err => {
//       console.error("Error retrieving Experience with id:", id, err);
//       res.status(500).send({
//         message: err.message || `Error retrieving Experience with id=${id}`
//       });
//     });
// };

// // Update an Experience by the id in the request
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
//           message: "Experience was updated successfully."
//         });
//       } else {
//         res.status(404).send({
//           success: false,
//           message: `Cannot update Experience with id=${id}. Maybe Experience was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       console.error("Error updating Experience with id:", id, err);
//       res.status(500).send({
//         success: false,
//         message: err.message || `Error updating Experience with id=${id}`
//       });
//     });
// };

// // Delete an Experience with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Task.destroy({ where: { id: id } })
//     .then(num => {
//       if (num == 1) {
//         res.send({ message: "Experience was deleted successfully!" });
//       } else {
//         res.status(404).send({
//           message: `Cannot delete Experience with id=${id}. Maybe Experience was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       console.error("Error deleting Experience with id:", id, err);
//       res.status(500).send({
//         message: err.message || `Could not delete Experience with id=${id}`
//       });
//     });
// };

// // Delete all Experience entries from the database.
// exports.deleteAll = (req, res) => {
//   Task.destroy({ where: {}, truncate: false })
//     .then(nums => res.send({ message: `${nums} Experience entries were deleted successfully!` }))
//     .catch(err => {
//       console.error("Error removing all Experience entries:", err);
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all Experience entries."
//       });
//     });
// };