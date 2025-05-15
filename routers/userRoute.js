import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", requireSignIn, isAdmin, getAllUsers);

// Get single user
router.get("/:id", requireSignIn, getSingleUser);

// Update user
router.put("/:id", requireSignIn, updateUser);

// Delete user
router.delete("/:id", requireSignIn, isAdmin, deleteUser);

export default router;
