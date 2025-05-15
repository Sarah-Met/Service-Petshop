import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createAppointment,
  getAllAppointments,
  approveAppointment,
  rejectAppointment,
  getUserAppointments,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// User creates an appointment
router.post('/', requireSignIn, createAppointment);

// User gets their own appointments
router.get('/', requireSignIn, getUserAppointments);

// Admin gets all appointments
router.get('/all', requireSignIn, isAdmin, getAllAppointments);

// Admin approves an appointment
router.put('/:id/approve', requireSignIn, isAdmin, approveAppointment);

// Admin rejects an appointment
router.put('/:id/reject', requireSignIn, isAdmin, rejectAppointment);

// User deletes their appointment
router.delete('/:id', requireSignIn, deleteAppointment);

export default router; 