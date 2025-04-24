const db = require("../models");
const Report = db.Report;

exports.create = async (req, res) => {
  try {
    const { type, message } = req.body;

    if (!type || !message) {
      return res.status(400).json({ message: "Type and message are required." });
    }

    const newReport = await Report.create({ type, message });
    res.status(201).json({ message: "Report submitted successfully.", data: newReport });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error retrieving reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
