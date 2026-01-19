const fs = require('fs').promises;
const path = require('path');
const inspectionClassesFilePath = path.join(__dirname, '../data/inspection-classes.json');
const inspectionHistoryFilePath = path.join(__dirname, '../data/mock-inspections.json');

const getInspectionClasses = async (req, res) => {
  try {
    const data = await fs.readFile(inspectionClassesFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Error reading inspection classes', error });
  }
};

const addInspectionClass = async (req, res) => {
  try {
    const { label, value } = req.body;
    if (!label || !value) {
      return res.status(400).json({ message: 'Label and value are required.' });
    }

    const data = await fs.readFile(inspectionClassesFilePath, 'utf8');
    const classes = JSON.parse(data);

    // Check for duplicates
    if (classes.some(c => c.value === value)) {
      return res.status(409).json({ message: `Class with value "${value}" already exists.` });
    }

    classes.push({ label, value });

    await fs.writeFile(inspectionClassesFilePath, JSON.stringify(classes, null, 2));

    res.status(201).json({ message: 'Inspection class added successfully', newClass: { label, value } });
  } catch (error) {
    res.status(500).json({ message: 'Error adding inspection class', error });
  }
};

const getInspectionHistory = async (req, res) => {
  try {
    // 1. Read data file
    const data = await fs.readFile(inspectionHistoryFilePath, 'utf8');
    let historyData = JSON.parse(data);

    // 2. Filter data based on query params
    const { startDate, finishDate, engineNumber } = req.query;
    let filteredData = historyData;

    if (engineNumber) {
        filteredData = filteredData.filter(item =>
          item.engine_number.toLowerCase().includes(engineNumber.toLowerCase())
        );
    }
    if (startDate) {
        const start = new Date(startDate);
        filteredData = filteredData.filter(item => new Date(item.created_at) >= start);
    }
    if (finishDate) {
        const end = new Date(finishDate);
        end.setHours(23, 59, 59, 999); // Include the whole day
        filteredData = filteredData.filter(item => new Date(item.created_at) <= end);
    }

    // 3. Paginate the filtered data
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = filteredData.length;
    
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // 4. Send response
    res.json({
      data: paginatedData,
      page,
      limit,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reading inspection history', error: error.message });
  }
};

module.exports = {
  getInspectionClasses,
  addInspectionClass,
  getInspectionHistory,
};
