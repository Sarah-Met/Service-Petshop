import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    itemCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const categoryModel = mongoose.model('Category', categorySchema);

export default categoryModel; 