const db = require("../models");
const Task = db.Task;
const StudentTask = db.StudentTask;
const Student = db.Student;
const Admin = db.Admin;
const Semester = db.Semester;
const { Op } = db.Sequelize;
const notificationController = require('./notification.controller');

// Create and Save a new Task
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({ 
      message: "Task name is required!" 
    });
  }

  try {
    // Create a Task object
    const task = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      points: req.body.points,
      Rationale: req.body.Rationale,
      scheduling_type: req.body.scheduling_type,
      reflection_required: req.body.reflection_required,
      majors: req.body.majors,
      CliftonStrengths: req.body.CliftonStrengths
    };

    // If semesterId is provided, use it
    if (req.body.semesterId) {
      task.semesterId = req.body.semesterId;
    } else if (req.body.semester) {
      // Try to find the semester by name
      const semesterRecord = await Semester.findOne({ 
        where: { name: req.body.semester }
      });
      
      if (semesterRecord) {
        task.semesterId = semesterRecord.id;
      }
    }

    // Save Task in the database
    const data = await Task.create(task);
    
    // If a flight plan ID is provided, associate task with that flight plan
    if (req.body.flightPlanId) {
      await db.FlightPlanTask.create({
        flightPlanId: req.body.flightPlanId,
        taskId: data.id
      });
    }
    
    res.status(201).send(data);
  } catch (err) {
    console.error("Error creating Task:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Task."
    });
  }
};

// Retrieve all Tasks
exports.findAll = async (req, res) => {
  try {
    // Add query parameters for filtering
    const category = req.query.category;
    const semesterId = req.query.semesterId;
    
    let condition = {};
    
    if (category) {
      condition.category = category;
    }
    
    // Handle semester filtering
    if (semesterId) {
      // If semesterId is provided, use it directly
      condition.semesterId = semesterId;
    }

    const tasks = await Task.findAll({ 
      where: condition,
      include: [
        {
          model: Semester,
          as: "semesterInfo",
          attributes: ['id', 'name', 'code', 'is_active'],
          required: false
        }
      ]
    });
    
    res.send(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).send({
      message: err.message || "Error retrieving tasks."
    });
  }
};

// Find a single Task by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  
  Task.findByPk(id, {
    include: [
      {
        model: Semester,
        as: "semesterInfo",
        attributes: ['id', 'name', 'code', 'is_active'],
        required: false
      }
    ]
  })
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

// Update a Task by id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    // If updating semester, handle ID
    if (req.body.semester && !req.body.semesterId) {
      const semesterRecord = await Semester.findOne({ 
        where: { name: req.body.semester }
      });
      
      if (semesterRecord) {
        req.body.semesterId = semesterRecord.id;
      }
    }
    
    const num = await Task.update(req.body, { where: { id: id } });
    
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
  } catch (err) {
    console.error("Error updating Task with id:", id, err);
    res.status(500).send({
      success: false,
      message: err.message || `Error updating Task with id=${id}`
    });
  }
};

// Delete a Task by id
exports.delete = (req, res) => {
  const id = req.params.id;
  
  // First remove associations in bridge table
  db.FlightPlanTask.destroy({ where: { taskId: id } })
    .then(() => {
      // Then delete the task
      return Task.destroy({ where: { id: id } });
    })
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

// Delete all Tasks
exports.deleteAll = (req, res) => {
  Task.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tasks were deleted successfully!` });
    })
    .catch(err => {
      console.error("Error removing all tasks:", err);
      res.status(500).send({
        message: err.message || "Some error occurred while removing all tasks."
      });
    });
};

// Mark a task as complete (by a student)
exports.markAsComplete = async (req, res) => {
  try {
    const taskId = req.params.id;
    const studentId = req.user.id;
    
    // Find the task
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find or create the student task record
    let studentTask = await StudentTask.findOne({
      where: { 
        studentId: studentId,
        taskId: taskId
      }
    });
    
    if (studentTask) {
      // Update existing record
      studentTask.status = "pending";
      studentTask.CompletionDate = new Date();
      await studentTask.save();
    } else {
      // Create new record
      studentTask = await StudentTask.create({
        studentId: studentId,
        taskId: taskId,
        status: "pending",
        CompletionDate: new Date()
      });
    }

    // Set task status to pending
    task.status = "Pending";
    await task.save();

    // Notify admins
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

// Approve a task
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

// Reject a task
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