import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Product, ProductDocument, CreateProductDto, UpdateProductDto } from '@app/common';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    async createProduct(createProductDto: CreateProductDto) {
        try {
            const newProduct = new this.productModel(createProductDto);
            await newProduct.save();
            return {
                success: true,
                message: 'Product created successfully',
                product: newProduct,
            };
        } catch (error) {
            throw new RpcException(`Failed to create product: ${error.message}`);
        }
    }

    async getAllProducts() {
        try {
            const products = await this.productModel.find();
            return {
                success: true,
                count: products.length,
                products,
            };
        } catch (error) {
            throw new RpcException(`Failed to fetch products: ${error.message}`);
        }
    }

    async getProductById(id: string) {
        try {
            const product = await this.productModel.findById(id);
            if (!product) {
                throw new RpcException({ message: 'Product not found', status: 404 });
            }
            return {
                success: true,
                product,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to fetch product: ${error.message}`);
        }
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
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
}
