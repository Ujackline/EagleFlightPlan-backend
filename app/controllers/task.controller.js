
// const db = require("../models");
// const Task = db.Task;

const db = require("../models");
const Task = db.Task;
const StudentTask = db.StudentTask;
const Student = db.Student;
const Admin = db.Admin;
const { Op } = db.Sequelize;






  const task = {
    category: req.body.category,
    id: req.body.id,
    taskName: req.body.name,
    description: req.body.description,
    Points: req.body.points,
    Rationale: req.body.Rationale,
    semester: req.body.semester,
    scheduling_type: req.body.scheduling_type,
    reflection_required: req.body.reflection_required,
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

exports.findAll = (req, res) => {
  Task.findAll()  // No filtering by ID
    .then(data => res.send(data))
    .catch(err => {
      console.error("Error retrieving tasks:", err);
      res.status(500).send({
        message: err.message || "Error retrieving tasks."
      });
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
 const StudentTask = db.StudentTask;
 const Student = db.Student;
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
     type: req.body.type,                                 
     taskName: req.body.taskName,
     description: req.body.description,
     NumOfPoints: req.body.NumOfPoints,
      Rationale: req.body.Rationale,
     grad_semester: req.body.grad_semester,
     scheduling_type: req.body.scheduling_type,
     reflection_required: req.body.reflection_required,
     //resumeId: req.body.resumeId,
     completion_type: req.body.completion_type,           
     majors: req.body.majors, // Fixed spelling
     CliftonStrengths: req.body.CliftonStrengths,
     badge: req.body.badge                                
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
 
// exports.completeTask = async (req, res) => {
//   try {
//     const { studentId, taskId } = req.body;

//     // Add logging to see incoming data
//     console.log("Complete Task Request:", { studentId, taskId });

//     const task = await db.Task.findByPk(taskId);
//     const student = await db.Student.findByPk(studentId);

//     if (!task || !student) {
//       return res.status(404).json({ success: false, message: "Task or student not found" });
//     }

//     const studentTask = await db.StudentTask.findOne({ where: { studentId, taskId } });

    
//     if (studentTask) {
//       return res.status(400).json({ success: false, message: "Task already completed" });
//     }


//     // await db.StudentTask.create({ studentId, taskId });
//     await db.StudentTask.create({
//       studentId,
//       taskId,
//       status: 'completed',  // Assuming the task is completed when added
//       CompletionDate: new Date(),  // Set the current date and time as the completion date
//       approved: false, //  new field
//     });


//     const adminUsers = await db.User.findAll({ where: { role: 'admin' } });

//     const notifications = adminUsers.map((admin) => ({
//       message: `Student ${student.name} has completed the task "${task.title}". Please review for approval.`,
//       status: "unread",
//       recipientId: admin.id,
//       type: "task_completion", // 👈 better than "general" so you can filter
//       taskId: task.id,
//       studentId: student.id

//     }));

//     await db.Notification.bulkCreate(notifications);

    
    

//   res.json({ success: true, message: "Task marked completed, pending approval" });


//     res.json({ success: true, newTotalPoints: student.points });
//   } catch (error) {
//     console.error("Error completing task:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.completeTask = async (req, res) => {
  try {
    const { studentId, taskId } = req.body;

    // Add logging to see incoming data
    console.log("Complete Task Request:", { studentId, taskId });

    const task = await db.Task.findByPk(taskId);
    const student = await db.Student.findByPk(studentId);

    if (!task || !student) {
      return res.status(404).json({ success: false, message: "Task or student not found" });
    }

    const studentTask = await db.StudentTask.findOne({ where: { studentId, taskId } });

    if (studentTask) {
      return res.status(400).json({ success: false, message: "Task already completed" });
    }

    // Create the student task record
    await db.StudentTask.create({
      studentId,
      taskId,
      status: 'completed',
      CompletionDate: new Date(),
      approved: false,
    });

    // Get all admin users
    const adminUsers = await db.User.findAll({ where: { role: 'admin' } });
    
    if (adminUsers.length === 0) {
      console.log("No admin users found to notify");
    }

    // Create a notification for each admin
    for (const admin of adminUsers) {
      console.log(`Creating notification for admin ${admin.id}`);
      
      // await db.Notification.create({
      //   message: `Student ${student.name} has completed the task "${task.taskName}". Please review for approval.`,
      //   status: "unread",
      //   recipientId: admin.id,
      //   type: "task_completion",
      //   taskId: task.id,
      //   studentId: student.id
      // });

      console.log(`Creating notification for student ${student}`);
      await db.Notification.create({
        message: `Student ${student.fName} ${student.lName} has completed the task "${task.taskName}". Please review for approval.`,
        status: "unread",
        recipientId: admin.id, // admin user ID
        type: "task_completion", // ✅ This is where you put it!
        taskId: task.id,
        studentId: student.id,
      });
      
    }

    return res.json({ 
      success: true, 
      message: "Task marked completed, pending approval" 
    });
    
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.approveTask = async (req, res) => {
  try {
    const { studentId, taskId } = req.body;
    console.log("Approve Task Request:", { studentId, taskId });
    

    const studentTask = await db.StudentTask.findOne({ where: { studentId, taskId } });
    if (!studentTask || studentTask.approved) return res.status(404).json({ message: "Invalid task" });

    const task = await db.Task.findByPk(taskId);
    const student = await db.Student.findByPk(studentId);

    studentTask.approved = true;
    await studentTask.save();

    student.points = (student.points || 0) + Number(task.NumOfPoints);
    await student.save();

    res.json({ success: true, message: "Task approved and points awarded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving task" });
  }
};

exports.getPendingTasks = async (req, res) => {
  try {
    const pendingTasks = await db.StudentTask.findAll({
      where: { approved: false },
      include: [
        { model: db.Student, attributes: ["id", "name"] },
        { model: db.Task, attributes: ["id", "title", "NumOfPoints"] }
      ]
    });
    res.json(pendingTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending tasks" });
  }
};






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
   console.log("wrong place")
 
   if (!req.body) {
     return res.status(400).send({
       success: false,
       message: "Data to update can not be empty!"
     });
   }
 
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

exports.markAsComplete = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "Pending";
    await task.save();

    await StudentTask.create({
      studentId: req.user.id,
      taskId: task.id,
      status: "pending",
      CompletionDate: new Date()
    });

    const admins = await Admin.findAll();

    for (const admin of admins) {
      await notificationController.sendNotification(
        admin.id,
        `Task "${task.name}" was marked as complete and needs review.`,
        "task_approval",
        { taskId: task.id }
      );
    }

    res.json({ message: "Task marked as Pending", task });
  } catch (error) {
    console.error("Error marking task complete:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

exports.approveTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "Approved";
    task.approvedBy = req.body.approvedBy || "Admin";
    task.completionDate = new Date();
    await task.save();

    const studentTask = await StudentTask.findOne({
      where: {
        taskId: task.id,
        status: { [Op.not]: "completed" }
      }
    });

    if (!studentTask) return res.status(404).json({ message: "No student-task record found" });

    studentTask.status = "completed";
    studentTask.CompletionDate = new Date();
    await studentTask.save();

    res.json({ message: "Task approved and marked complete", task });
  } catch (error) {
    console.error("Error approving task:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.rejectTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = "Rejected";
    await task.save();

    res.json({ message: "Task rejected successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting task", error });
  }
};

