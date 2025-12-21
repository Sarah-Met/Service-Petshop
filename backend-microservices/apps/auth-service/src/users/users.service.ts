import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UpdateUserDto } from '@app/common';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async getAllUsers() {
        try {
            const users = await this.userModel.find().select('-password');
            return {
                success: true,
                count: users.length,
                users,
            };
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.userModel.findById(id).select('-password');
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return {
                success: true,
                user,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async create(userData: any): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userModel.findByIdAndUpdate(
                id,
                updateUserDto,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return {
                success: true,
                message: 'User updated successfully',
                user,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    async deleteUser(id: string) {
        try {
            const user = await this.userModel.findByIdAndDelete(id);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            return {
                success: true,
                message: 'User deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
}
