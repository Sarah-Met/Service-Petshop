import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    petName: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    time: string;

    @Prop({ required: false, default: 'General Checkup' })
    service: string;

    @Prop({ required: false })
    notes: string;

    @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] })
    status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
