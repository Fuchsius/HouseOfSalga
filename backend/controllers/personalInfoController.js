const PersonalInfo = require('../models/PersonalInfo');

// Create personal info
exports.createPersonalInfo = async (req, res) => {
  try {
    const personalInfo = new PersonalInfo(req.body);
    await personalInfo.save();
    res.status(201).json(personalInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all personal info records
exports.getAllPersonalInfo = async (req, res) => {
  try {
    const infos = await PersonalInfo.find();
    res.json(infos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get one by ID
exports.getPersonalInfoById = async (req, res) => {
  try {
    const info = await PersonalInfo.findById(req.params.id);
    if (!info) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update personal info
exports.updatePersonalInfo = async (req, res) => {
  try {
    const updated = await PersonalInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete personal info
exports.deletePersonalInfo = async (req, res) => {
  try {
    const deleted = await PersonalInfo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
