import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Category, CategoryDocument, CreateCategoryDto, UpdateCategoryDto } from '@app/common';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        try {
            const existingCategory = await this.categoryModel.findOne({ slug: createCategoryDto.slug });
            if (existingCategory) {
                throw new RpcException('Category with this slug already exists');
            }

            const newCategory = new this.categoryModel(createCategoryDto);
            await newCategory.save();
            return {
                success: true,
                message: 'Category created successfully',
                category: newCategory,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to create category: ${error.message}`);
        }
    }

    async getAllCategories() {
        try {
            const categories = await this.categoryModel.find();
            return {
                success: true,
                count: categories.length,
                categories,
            };
        } catch (error) {
            throw new RpcException(`Failed to fetch categories: ${error.message}`);
        }
    }

    async getCategoryById(id: string) {
        try {
            const category = await this.categoryModel.findById(id);
            if (!category) {
                throw new RpcException({ message: 'Category not found', status: 404 });
            }
            return {
                success: true,
                category,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to fetch category: ${error.message}`);
        }
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.categoryModel.findByIdAndUpdate(
                id,
                updateCategoryDto,
                { new: true, runValidators: true }
            );

            if (!category) {
                throw new RpcException({ message: 'Category not found', status: 404 });
            }

            return {
                success: true,
                message: 'Category updated successfully',
                category,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to update category: ${error.message}`);
        }
    }

    async deleteCategory(id: string) {
        try {
            const category = await this.categoryModel.findByIdAndDelete(id);
            if (!category) {
                throw new RpcException({ message: 'Category not found', status: 404 });
            }

            return {
                success: true,
                message: 'Category deleted successfully',
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to delete category: ${error.message}`);
        }
    }
}
