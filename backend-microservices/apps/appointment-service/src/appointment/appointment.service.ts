import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Appointment, AppointmentDocument, CreateAppointmentDto, UpdateAppointmentDto } from '@app/common';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    ) { }

    async createAppointment(createAppointmentDto: CreateAppointmentDto) {
        try {
            const newAppointment = new this.appointmentModel(createAppointmentDto);
            await newAppointment.save();
            return {
                success: true,
                message: 'Appointment created successfully',
                appointment: newAppointment,
            };
        } catch (error) {
            throw new RpcException(`Failed to create appointment: ${error.message}`);
        }
    }

    async getAllAppointments() {
        try {
            const appointments = await this.appointmentModel.find().populate('user', '-password');
            return {
                success: true,
                count: appointments.length,
                appointments,
            };
        } catch (error) {
            throw new RpcException(`Failed to fetch appointments: ${error.message}`);
        }
    }

    async getAppointmentById(id: string) {
        try {
            const appointment = await this.appointmentModel.findById(id).populate('user', '-password');
            if (!appointment) {
                throw new RpcException({ message: 'Appointment not found', status: 404 });
            }
            return {
                success: true,
                appointment,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to fetch appointment: ${error.message}`);
        }
    }

    async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto) {
        try {
            const appointment = await this.appointmentModel.findByIdAndUpdate(
                id,
                updateAppointmentDto,
                { new: true, runValidators: true }
            ).populate('user', '-password');

            if (!appointment) {
                throw new RpcException({ message: 'Appointment not found', status: 404 });
            }

            return {
                success: true,
                message: 'Appointment updated successfully',
                appointment,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to update appointment: ${error.message}`);
        }
    }

    async deleteAppointment(id: string) {
        try {
            const appointment = await this.appointmentModel.findByIdAndDelete(id);
            if (!appointment) {
                throw new RpcException({ message: 'Appointment not found', status: 404 });
            }

            return {
                success: true,
                message: 'Appointment deleted successfully',
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(`Failed to delete appointment: ${error.message}`);
        }
    }
}
