const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-temp-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create Appointment (Protected) with Enhanced Validation
router.post('/', authenticateToken, async (req, res) => {
  const { doctorId, date, status } = req.body;
  const dateObj = new Date(date);

  // Validate date
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  // Validate doctorId (must be a non-empty string or ObjectId)
  if (!doctorId || typeof doctorId !== 'string' || doctorId.trim().length === 0) {
    return res.status(400).json({ message: 'Invalid doctorId' });
  }

  // Validate status (if provided, must be one of the allowed values)
  if (status && !['pending', 'confirmed', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date: dateObj,
      status: status || 'pending', // Default to 'pending' if not provided
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Appointments for a Patient (Protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update Appointment (Protected) with Validation
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { doctorId, date, status } = req.body;
  const dateObj = date ? new Date(date) : null;

  // Validate date if provided
  if (date && isNaN(dateObj.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  // Validate doctorId if provided
  if (doctorId && (typeof doctorId !== 'string' || doctorId.trim().length === 0)) {
    return res.status(400).json({ message: 'Invalid doctorId' });
  }

  // Validate status if provided
  if (status && !['pending', 'confirmed', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { doctorId, date: dateObj, status },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
