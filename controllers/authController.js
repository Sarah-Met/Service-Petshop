import userModel from "../models/userModel.js"
import { comparePassword, hashPassword} from "./../helpers/authHelper.js"
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, securityAnswer } = req.body;
        console.log('Received registration request:', req.body);
        
        // Validation
        if (!firstName) {
            return res.status(400).send({ success: false, message: 'First name is required' });
        }
        if (!lastName) {
            return res.status(400).send({ success: false, message: 'Last name is required' });
        }
        if (!email) {
            return res.status(400).send({ success: false, message: 'Email is required' });
        }
        if (!phoneNumber) {
            return res.status(400).send({ success: false, message: 'Phone number is required' });
        }
        if (!password) {
            return res.status(400).send({ success: false, message: 'Password is required' });
        }
        if (!securityAnswer) {
            return res.status(400).send({ success: false, message: 'Security answer is required' });
        }

        // Check existing user
        const lowerEmail = email.toLowerCase();
        const existingUser = await userModel.findOne({ email: lowerEmail });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: 'Email is already registered, please login',
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Save user
        const user = await new userModel({
            firstName,
            lastName,
            email: lowerEmail,
            phoneNumber,
            password: hashedPassword,
            securityAnswer,
            securityQuestion: 'What is your favorite sport?'
        }).save();

        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.log('Registration error:', error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error: error.message
        });
    }
};

//POST LOGIN
export const loginController = async (req,res) => {
    try {
        const {email,password} = req.body
        //validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user
        const lowerEmail = email.toLowerCase();
        const user = await userModel.findOne({email: lowerEmail})
        if(!user) {
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match) {
            return res.status(401).send({
                success:false,
                message:'Invalid password'
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn:"7d",
        });
        res.status(200).send({
            success: true,
            message:"Login successful",
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
};

//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, securityAnswer, newPassword } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        if (!securityAnswer) {
            return res.status(400).send({ message: "Security answer is required" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New password is required" });
        }

        // Find user by email
        const lowerEmail = email.toLowerCase();
        const user = await userModel.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }

        // Check security answer (case-insensitive)
        if (
            !user.securityAnswer ||
            user.securityAnswer.trim().toLowerCase() !== securityAnswer.trim().toLowerCase()
        ) {
            return res.status(401).send({
                success: false,
                message: "Invalid security answer",
            });
        }

        // Hash new password and update
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).send({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};
