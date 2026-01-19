const db = require('../models');
const RobotInspection = db.RobotInspection;
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/robot-inspections');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

exports.uploadInspection = upload.single('inspection_media');

exports.createInspection = async (req, res) => {
  try {
    const { robot_id, line_id, machine_id } = req.body;
    const image_path = req.file ? req.file.path : null;

    if (!robot_id || !image_path) {
      return res.status(400).json({ error: 'Robot ID and inspection media are required' });
    }

    // Mock AI analysis (replace with actual AI model integration)
    const aiResults = await performAIAnalysis(image_path);

    const inspection = await RobotInspection.create({
      robot_id,
      line_id,
      machine_id,
      inspection_date: new Date(),
      image_path,
      ai_results: aiResults,
      status: 'pending'
    });

    res.status(201).json(inspection);
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ error: 'Failed to create inspection' });
  }
};

exports.getInspections = async (req, res) => {
  try {
    const { status, robot_id, line_id, machine_id } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (robot_id) whereClause.robot_id = robot_id;
    if (line_id) whereClause.line_id = line_id;
    if (machine_id) whereClause.machine_id = machine_id;

    const inspections = await RobotInspection.findAll({
      where: whereClause,
      order: [['inspection_date', 'DESC']]
    });

    res.json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ error: 'Failed to fetch inspections' });
  }
};

exports.updateInspection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, user_validation } = req.body;

    const inspection = await RobotInspection.findByPk(id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    await inspection.update({
      status,
      user_validation
    });

    res.json(inspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    res.status(500).json({ error: 'Failed to update inspection' });
  }
};

exports.deleteInspection = async (req, res) => {
  try {
    const { id } = req.params;

    const inspection = await RobotInspection.findByPk(id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }

    // Delete associated file
    if (inspection.image_path && fs.existsSync(inspection.image_path)) {
      fs.unlinkSync(inspection.image_path);
    }

    await inspection.destroy();
    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    res.status(500).json({ error: 'Failed to delete inspection' });
  }
};

// Mock AI analysis function (replace with actual AI model)
async function performAIAnalysis(imagePath) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock results - in real implementation, this would analyze the image
  const mockResults = {
    confidence_score: Math.random() * 100,
    detected_issues: [
      {
        type: 'oil_leak',
        severity: 'medium',
        location: 'engine_block',
        confidence: 85
      },
      {
        type: 'wear',
        severity: 'low',
        location: 'piston_rings',
        confidence: 72
      }
    ],
    recommendations: [
      'Check oil levels and replace gaskets if necessary',
      'Monitor piston ring wear in next maintenance cycle'
    ]
  };

  return mockResults;
}
