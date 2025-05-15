import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                return !this.confirmPassword || this.confirmPassword === password;
            },
            message: 'Passwords do not match!'
        }
    },
    role: {
        type: Number,
        default: 0
    },
    securityAnswer: {
        type: String,
        required: true
    },
    securityQuestion: {
        type: String,
        required: true
    }
}, { 
    timestamps: true,
    strict: true,
    strictQuery: true
});

// Virtual for confirmPassword
userSchema.virtual('confirmPassword')
    .get(function() {
        return this._confirmPassword;
    })
    .set(function(value) {
        this._confirmPassword = value;
    });

// Pre-save middleware to ensure field order
userSchema.pre('save', function(next) {
    const orderedDoc = {
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        email: this.email,
        password: this.password,
        role: this.role,
        securityAnswer: this.securityAnswer,
        securityQuestion: this.securityQuestion
    };
    
    Object.keys(this.toObject()).forEach(key => {
        if (!orderedDoc.hasOwnProperty(key) && key !== '_id' && !key.startsWith('_')) {
            this[key] = undefined;
            delete this[key];
        }
    });
    
    Object.keys(orderedDoc).forEach(key => {
        if (this[key] !== undefined) {
            const value = this[key];
            this[key] = undefined;
            delete this[key];
            this[key] = value;
        }
    });
    
    next();
});

const User = mongoose.model('User', userSchema);
export default User;