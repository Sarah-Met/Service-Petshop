import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: [{ product: { type: Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }], required: true })
    products: Array<{ product: Types.ObjectId; quantity: number; price: number }>;

    @Prop({ required: true, min: 0 })
    totalAmount: number;

    @Prop({ default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
    status: string;

    @Prop({ type: Object })
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
