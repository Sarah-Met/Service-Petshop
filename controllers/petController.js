import Pet from '../models/petModel.js';
import User from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to save base64 image
const saveBase64Image = (base64String, filename) => {
    try {
        const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }

        const imageBuffer = Buffer.from(matches[2], 'base64');
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, imageBuffer);
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error saving base64 image:', error);
        throw new Error('Failed to save image');
    }
};

// Create a new pet
export const createPet = async (req, res) => {
    try {
        console.log('Create pet request received:', {
            body: req.body,
            file: req.file,
            user: req.user,
            headers: req.headers
        });

        const { name, breed, age, ageUnit, price, characteristics, category } = req.body;
        
        // Validate required fields with specific messages
        const validationErrors = [];
        
        if (!name || name.trim() === '') {
            validationErrors.push('Name is required');
        }
        
        if (!breed || breed.trim() === '') {
            validationErrors.push('Breed is required');
        }
        
        if (!age || isNaN(age) || age < 0) {
            validationErrors.push('Age must be a positive number');
        }

        if (price !== undefined && (isNaN(price) || price < 0)) {
            validationErrors.push('Price must be a non-negative number');
        }
        
        if (!characteristics || (Array.isArray(characteristics) && characteristics.length === 0)) {
            validationErrors.push('At least one characteristic is required');
        }

        if (!category) {
            validationErrors.push('Category is required');
        }

        if (!ageUnit || !['weeks', 'months', 'years'].includes(ageUnit)) {
            validationErrors.push('Age unit must be one of: weeks, months, years');
        }

        if (validationErrors.length > 0) {
            console.log('Validation errors:', validationErrors);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Handle image upload
        let imagePath;
        try {
            if (req.file) {
                // If file is uploaded through form-data
                console.log('File uploaded:', req.file);
                imagePath = `/uploads/${req.file.filename}`;
            } else if (req.body.image) {
                // If image is sent as base64 in JSON
                console.log('Base64 image received');
                const filename = `${Date.now()}-${name}.jpg`;
                imagePath = saveBase64Image(req.body.image, filename);
            } else {
                console.log('No image provided');
                return res.status(400).json({
                    success: false,
                    error: 'Image is required'
                });
            }
        } catch (error) {
            console.error('Error handling image:', error);
            return res.status(400).json({
                success: false,
                error: 'Failed to process image: ' + error.message
            });
        }

        // Validate user exists
        if (!req.user || !req.user._id) {
            console.log('No user found in request');
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        // Format characteristics
        const characteristicsArray = Array.isArray(characteristics) 
            ? characteristics 
            : characteristics.split(',').map(c => c.trim()).filter(c => c);

        if (characteristicsArray.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one characteristic is required'
            });
        }

        console.log('Creating pet with data:', {
            name,
            breed,
            age,
            ageUnit,
            price,
            category,
            characteristics: characteristicsArray,
            image: imagePath,
            owner: req.user._id
        });

        const pet = await Pet.create({
            name: name.trim(),
            breed: breed.trim(),
            age: Number(age),
            ageUnit,
            price: price !== undefined ? Number(price) : 0,
            category,
            image: imagePath,
            characteristics: characteristicsArray,
            owner: req.user._id
        });

        console.log('Pet created successfully:', pet);

        res.status(201).json({
            success: true,
            pet
        });
    } catch (error) {
        console.error('Error in createPet:', error);
        // Log the full error details
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all pets
export const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find()
            .populate('owner', 'name email')
            .populate('category', 'name');
        res.status(200).json({
            success: true,
            count: pets.length,
            pets
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get pets by category
export const getPetsByCategory = async (req, res) => {
    try {
        const { type } = req.params;
        const pets = await Pet.find({ type }).populate('owner', 'name email');
        res.status(200).json({
            success: true,
            count: pets.length,
            pets
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get single pet
export const getPet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('owner', 'name email');
        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.status(200).json({
            success: true,
            pet
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update pet
export const updatePet = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Validate required fields
        const validationErrors = [];
        
        if (!updateData.name || updateData.name.trim() === '') {
            validationErrors.push('Name is required');
        }
        
        if (!updateData.breed || updateData.breed.trim() === '') {
            validationErrors.push('Breed is required');
        }
        
        if (!updateData.age || isNaN(updateData.age) || updateData.age < 0) {
            validationErrors.push('Age must be a positive number');
        }

        if (updateData.price === undefined || updateData.price === null || isNaN(updateData.price) || updateData.price < 0) {
            validationErrors.push('Price must be a non-negative number');
        }
        
        if (!updateData.characteristics || (Array.isArray(updateData.characteristics) && updateData.characteristics.length === 0)) {
            validationErrors.push('At least one characteristic is required');
        }

        if (!updateData.category) {
            validationErrors.push('Category is required');
        }

        if (!updateData.ageUnit || !['weeks', 'months', 'years'].includes(updateData.ageUnit)) {
            validationErrors.push('Age unit must be one of: weeks, months, years');
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Handle image update
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (updateData.image && !updateData.image.startsWith('/uploads/')) {
            // Only process base64 image if it's not already a file path
            const filename = `${Date.now()}-${updateData.name || 'pet'}.jpg`;
            try {
                const matches = updateData.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const imageBuffer = Buffer.from(matches[2], 'base64');
                    const filePath = path.join(__dirname, '..', 'uploads', filename);
                    fs.writeFileSync(filePath, imageBuffer);
                    updateData.image = `/uploads/${filename}`;
                }
            } catch (error) {
                console.error('Error processing image:', error);
                // If image processing fails, keep the existing image
                delete updateData.image;
            }
        }

        // Handle characteristics array
        if (updateData.characteristics) {
            updateData.characteristics = Array.isArray(updateData.characteristics) 
                ? updateData.characteristics 
                : updateData.characteristics.split(',').map(c => c.trim()).filter(c => c);
        }

        // Convert numeric fields
        if (updateData.age) updateData.age = Number(updateData.age);
        if (updateData.price) updateData.price = Number(updateData.price);
        // category is already in updateData from req.body

        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }

        res.status(200).json({
            success: true,
            pet
        });
    } catch (error) {
        console.error('Error in updatePet:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete pet
export const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({
                success: false,
                error: 'Pet not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pet deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}; 