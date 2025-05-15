import express from 'express';
import { createPet, getAllPets, getPetsByCategory, getPet, updatePet, deletePet } from '../controllers/petController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { upload, handleMulterError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Create pet route
router.post('/', requireSignIn, upload.single('image'), handleMulterError, createPet);

// Get all pets
router.get('/', getAllPets);

// Get pets by category
router.get('/category/:type', getPetsByCategory);

// Get single pet
router.get('/:id', getPet);

// Update pet
router.put('/:id', requireSignIn, upload.single('image'), handleMulterError, updatePet);

// Delete pet
router.delete('/:id', requireSignIn, deletePet);

export default router; 