import express from "express";
// for task
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// routing
// register || method post
router.post("/register", registerController);

// login || method post
router.post("/login", loginController);

// forgot password || method post
router.post("/forgot-password", forgotPasswordController);

// test route
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// export the router so it can be used in your main app
export default router;
