const fs = require('fs').promises;
const path = require('path');
const settingsFilePath = path.join(__dirname, '../data/camera-settings.json');

const getCameraSettings = async (req, res) => {
  try {
    const data = await fs.readFile(settingsFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Error reading camera settings', error });
  }
};

const saveCameraSettings = async (req, res) => {
  try {
    const { camera, settings } = req.body;
    const data = await fs.readFile(settingsFilePath, 'utf8');
    const allSettings = JSON.parse(data);
    allSettings[camera] = settings;
    await fs.writeFile(settingsFilePath, JSON.stringify(allSettings, null, 2));
    res.json({ message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving camera settings', error });
  }
};

const getCameraList = async (req, res) => {

  try {
    const data = await fs.readFile(settingsFilePath, 'utf8');
    const allSettings = JSON.parse(data);
    res.json(Object.keys(allSettings));
  } catch (error) {
    res.status(500).json({ message: 'Error reading camera list', error });
  }
  
}

module.exports = {
  getCameraSettings,
  saveCameraSettings,
  getCameraList,
};