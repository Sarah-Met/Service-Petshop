import Appointment from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import petModel from '../models/petModel.js';

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { fullName, email, phone, petName, date, notes } = req.body;
    const user = req.user?._id;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    const appointment = new Appointment({ user, fullName, email, phone, petName, date, notes });
    await appointment.save();
    res.status(201).json({ success: true, message: 'Appointment request submitted', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
  }
};

// Get all appointments (admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('user', 'firstName lastName email').populate('pet', 'name type');
    console.log('Fetched appointments:', appointments);
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
};

// Approve appointment (admin)
export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment approved', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving appointment', error: error.message });
  }
};

// Reject appointment (admin)
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, message: 'Appointment rejected', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting appointment', error: error.message });
  }
};

// Get appointments for the logged-in user
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate('pet', 'name type');
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user appointments', error: error.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
  }
}; 