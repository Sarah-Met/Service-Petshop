import userModel from "../models/userModel.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({})
            .select('firstName lastName email phoneNumber -_id')
            .lean();
        res.status(200).send({
            success: true,
            message: "All Users List",
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting users",
            error,
        });
    }
};

// Get single user
export const getSingleUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
            .select('firstName lastName email phoneNumber -_id')
            .lean();
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Single User Fetched",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting single user",
            error,
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body;
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                phoneNumber
            },
            { new: true }
        ).select('_id firstName lastName email phoneNumber');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "User Updated Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in updating user",
            error,
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "User Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting user",
            error,
        });
    }
};
