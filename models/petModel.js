import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    breed: {
        type: String,
        required: [true, 'Pet breed is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Pet age is required']
    },
    ageUnit: {
        type: String,
        enum: ['weeks', 'months', 'years'],
        default: 'years',
        required: true
    },
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String,
        required: [true, 'Pet image is required']
    },
    characteristics: [{
        type: String,
        required: [true, 'At least one characteristic is required']
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet; 