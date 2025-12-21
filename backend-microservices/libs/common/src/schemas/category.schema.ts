import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, unique: true, trim: true })
    slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
