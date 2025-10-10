import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  petName: { type: String },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: false },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema); 