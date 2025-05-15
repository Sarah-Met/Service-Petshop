import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB ${conn.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`Error in MongoDB: ${error}`.bgRed.white);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate('pet', 'name type');
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user appointments', error: error.message });
  }
};
