import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ required: true, trim: true })
    lastName: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 0 })
    role: number;

    @Prop({ required: true })
    securityAnswer: string;

    @Prop({ required: true })
    securityQuestion: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
