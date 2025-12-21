import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Pet, PetDocument, CreatePetDto, UpdatePetDto, Product, ProductDocument, Category, CategoryDocument } from '@app/common';

@Injectable()
export class PetService {
    constructor(
        @InjectModel(Pet.name) private petModel: Model<PetDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    // ... (Existing Pet Methods) ...

    async createPet(createPetDto: CreatePetDto) {
        try {
            const newPet = new this.petModel(createPetDto);
            await newPet.save();
            return {
                success: true,
                message: 'Pet created successfully',
                pet: newPet,
            };
        } catch (error) {
            throw new RpcException(`Failed to create pet: ${error.message}`);
        }
    }

    async getAllPets() {
        try {
            const pets = await this.petModel.find();
            return {
                success: true,
                count: pets.length,
                pets,
            };
        } catch (error) {
            throw new RpcException(`Failed to fetch pets: ${error.message}`);
        }
    }

    async getPetById(id: string) {
        try {
            const pet = await this.petModel.findById(id);
            if (!pet) {
                throw new RpcException({ message: 'Pet not found', status: 404 });
            }
            return {
                success: true,
                pet,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to fetch pet: ${error.message}`);
        }
    }

    async updatePet(id: string, updatePetDto: UpdatePetDto) {
        try {
            const pet = await this.petModel.findByIdAndUpdate(
                id,
                updatePetDto,
                { new: true, runValidators: true }
            );

            if (!pet) {
                throw new RpcException({ message: 'Pet not found', status: 404 });
            }

            return {
                success: true,
                message: 'Pet updated successfully',
                pet,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to update pet: ${error.message}`);
        }
    }

    async deletePet(id: string) {
        try {
            const pet = await this.petModel.findByIdAndDelete(id);
            if (!pet) {
                throw new RpcException({ message: 'Pet not found', status: 404 });
            }

            return {
                success: true,
                message: 'Pet deleted successfully',
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to delete pet: ${error.message}`);
        }
    }

    // --- Product Methods ---

    async updateProduct(id: string, updateProductDto: any) {
        try {
            const product = await this.productModel.findByIdAndUpdate(
                id,
                updateProductDto,
                { new: true, runValidators: true }
            );

            if (!product) {
                throw new RpcException({ message: 'Product not found', status: 404 });
            }

            return {
                success: true,
                message: 'Product updated successfully',
                product,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to update product: ${error.message}`);
        }
    }

    async deleteProduct(id: string) {
        try {
            const product = await this.productModel.findByIdAndDelete(id);
            if (!product) {
                throw new RpcException({ message: 'Product not found', status: 404 });
            }

            return {
                success: true,
                message: 'Product deleted successfully',
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to delete product: ${error.message}`);
        }
    }

    // --- Category Methods ---

    async updateCategory(id: string, updateCategoryDto: any) {
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
