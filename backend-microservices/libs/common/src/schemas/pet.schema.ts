import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    breed: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true, enum: ['weeks', 'months', 'years'], default: 'years' })
    ageUnit: string;

    @Prop({ default: 0, min: 0 })
    price: number;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Types.ObjectId;

    @Prop({ required: true })
    image: string;

    @Prop({ type: [String], required: true })
    characteristics: string[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: Types.ObjectId;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
