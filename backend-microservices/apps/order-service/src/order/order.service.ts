import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Order, OrderDocument, CreateOrderDto, UpdateOrderDto } from '@app/common';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto) {
        try {
            const newOrder = new this.orderModel(createOrderDto);
            await newOrder.save();
            return {
                success: true,
                message: 'Order created successfully',
                order: newOrder,
            };
        } catch (error) {
            throw new RpcException(`Failed to create order: ${error.message}`);
        }
    }

    async getAllOrders() {
        try {
            const orders = await this.orderModel.find().populate('user', '-password').populate('products.product');
            return {
                success: true,
                count: orders.length,
                orders,
            };
        } catch (error) {
            throw new RpcException(`Failed to fetch orders: ${error.message}`);
        }
    }

    async getOrderById(id: string) {
        try {
            const order = await this.orderModel.findById(id).populate('user', '-password').populate('products.product');
            if (!order) {
                throw new RpcException({ message: 'Order not found', status: 404 });
            }
            return {
                success: true,
                order,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to fetch order: ${error.message}`);
        }
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
        try {
            const order = await this.orderModel.findByIdAndUpdate(
                id,
                updateOrderDto,
                { new: true, runValidators: true }
            ).populate('user', '-password').populate('products.product');

            if (!order) {
                throw new RpcException({ message: 'Order not found', status: 404 });
            }

            return {
                success: true,
                message: 'Order updated successfully',
                order,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to update order: ${error.message}`);
        }
    }

    async deleteOrder(id: string) {
        try {
            const order = await this.orderModel.findByIdAndDelete(id);
            if (!order) {
                throw new RpcException({ message: 'Order not found', status: 404 });
            }

            return {
                success: true,
                message: 'Order deleted successfully',
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to delete order: ${error.message}`);
        }
    }
}
