import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '@app/common';

@Controller()
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @MessagePattern({ cmd: 'create_appointment' })
    async createAppointment(@Payload() createAppointmentDto: CreateAppointmentDto) {
        console.log('AppointmentService: Received create_appointment request', createAppointmentDto);
        try {
            const result = await this.appointmentService.createAppointment(createAppointmentDto);
            console.log('AppointmentService: Created successfully', result);
            return result;
        } catch (error) {
            console.error('AppointmentService: Error creating appointment', error);
            throw error;
        }
    }

    @MessagePattern({ cmd: 'get_all_appointments' })
    async getAllAppointments() {
        return this.appointmentService.getAllAppointments();
    }

    @MessagePattern({ cmd: 'get_appointment_by_id' })
    async getAppointmentById(@Payload() id: string) {
        return this.appointmentService.getAppointmentById(id);
    }

    @MessagePattern({ cmd: 'update_appointment' })
    async updateAppointment(@Payload() payload: { id: string; updateAppointmentDto: UpdateAppointmentDto }) {
        console.log(`AppointmentService: Received update request for ${payload.id}`, payload.updateAppointmentDto);
        try {
            return await this.appointmentService.updateAppointment(payload.id, payload.updateAppointmentDto);
        } catch (error) {
            console.error(`AppointmentService: Error updating appointment ${payload.id}`, error);
            throw error;
        }
    }

    @MessagePattern({ cmd: 'delete_appointment' })
    async deleteAppointment(@Payload() id: string) {
        return this.appointmentService.deleteAppointment(id);
    }
}
