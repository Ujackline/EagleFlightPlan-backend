const db = require("../models");
const Task = db.Task;
const StudentTask = db.StudentTask;
const Student = db.Student;
const Admin = db.Admin;
const Semester = db.Semester; 
const { Op } = db.Sequelize;

// Create and Save a new Task
exports.create = (req, res) => {
  // Validate request
  if (!req.body.taskName) {
    console.log(req.body);
    return res.status(400).send({ message: "Task name is required!" });
  }

  // Create a Task object
  const task = {
    category: req.body.category,
    taskName: req.body.taskName,
    description: req.body.description,
    NumOfPoints: req.body.NumOfPoints,
    grad_semester: req.body.grad_semester,
    majors: req.body.majors,
    CliftonStrengths: req.body.CliftonStrengths,
    applicableYear: req.body.applicableYear || null 
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

// Retrieve all Tasks
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

// Update a Task by the id in the request
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

// In your taskController.js
exports.completeTask = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Task ID: ${id} - Starting completion process`);
    
    // Find the task
    const task = await Task.findByPk(id);
    if (!task) {
      console.log(`Task ID: ${id} - Task not found`);
      return res.status(404).json({ 
        success: false, 
        error: "Task not found" 
      });
    }
    
    // Check the database column names based on your schema
    console.log("Task model properties:", Object.keys(task.dataValues));
    
    // First, check if we need to use update instead of direct assignment
    const updateResult = await Task.update(
      {
        completed: true,
        status: 'Approved',
        completionDate: new Date()
      },
      {
        where: { id: id },
        returning: true
      }
    );
    
    console.log("Database update result:", updateResult);
    
    // Re-fetch the task to confirm changes
    const updatedTask = await Task.findByPk(id);
    console.log("Task after update:", {
      id: updatedTask.id,
      taskName: updatedTask.taskName,
      status: updatedTask.status,
      completed: updatedTask.completed
    });
    
    // Return success response
    return res.json({ 
      success: true,
      message: "Task marked as completed successfully!", 
      task: updatedTask,
      pointsChange: parseInt(updatedTask.NumOfPoints || 0)
    });
  } catch (error) {
    console.error("Error in completeTask:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal Server Error: " + error.message 
    });
  }
};

// Delete a Task with the specified id in the request
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

// Delete all Task entries from the database
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



exports.findByFlightPlan = (req, res) => {
  const flightPlanId = req.params.flightPlanId;
  
  // You'll need to customize this query based on your database structure
  db.Task.findAll({
    include: [{
      model: db.FlightPlan,
      as: "flightPlans",
      through: {
        where: { flightPlanId: flightPlanId }
      },
      required: true
    }]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving tasks for flight plan ID: " + flightPlanId
      });
    });
};
// Mark a task as pending completion (requires review)
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

    // Check if notificationController is defined before using it
    if (typeof notificationController !== 'undefined') {
      for (const admin of admins) {
        await notificationController.sendNotification(
          admin.id,
          `Task "${task.name}" was marked as complete and needs review.`,
          "task_approval",
          { taskId: task.id }
        );
      }
    } else {
      console.log("Notification controller not available, skipping notifications");
    }

    res.json({ message: "Task marked as Pending", task });
  } catch (error) {
    console.error("Error marking task complete:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Approve a completed task
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

// Reject a task that was marked as complete
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

// Get tasks completed by a specific student
exports.getStudentTasksByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // First get the student ID from the user ID
    const student = await Student.findOne({
      where: { userId: userId }
    });
    
    if (!student) {
      return res.status(404).json({ message: "Student not found for this user" });
    }
    
    // Get all student tasks for this student
    const studentTasks = await StudentTask.findAll({
      where: { studentId: student.id },
      include: [{
        model: Task,
        as: "task"  // Make sure this alias matches your model association
      }]
    });
    
    res.send(studentTasks);
  } catch (error) {
    console.error("Error getting student tasks:", error);
    res.status(500).json({ 
      message: "Error retrieving student tasks",
      error: error.message
    });
  }
};

// Complete a task for a specific student
exports.completeTaskForStudent = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId || req.user.id; // Get from params or auth token
    
    // Get the student record
    const student = await Student.findOne({
      where: { userId: userId }
    });
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Check if a student task record already exists
    let studentTask = await StudentTask.findOne({
      where: {
        studentId: student.id,
        taskId: taskId
      }
    });
    
    if (studentTask) {
      // Update existing record
      studentTask.status = 'completed';
      studentTask.CompletionDate = new Date(); // CORRECTED: Use capital C
      await studentTask.save();
    } else {
      // Create new record
      studentTask = await StudentTask.create({
        studentId: student.id,
        taskId: taskId,
        status: 'completed',
        CompletionDate: new Date() // CORRECTED: Use capital C
      });
    }
    
    // Return success response
    return res.json({
      success: true,
      message: "Task completed successfully for student",
      studentTask,
      task,
      pointsChange: parseInt(task.NumOfPoints || 0)
    });
  } catch (error) {
    console.error("Error completing task for student:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message
    });
  }
};
exports.findByApplicableYear = async (req, res) => {
  try {
    const { year } = req.params;
    
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { applicableYear: year },
          { applicableYear: null } // Tasks applicable to all years
        ]
      }
    });

    res.send(tasks);
  } catch (err) {
    console.error("Error finding tasks by applicable year:", err);
    res.status(500).send({
      message: err.message || "Error retrieving tasks"
    });
  }
};