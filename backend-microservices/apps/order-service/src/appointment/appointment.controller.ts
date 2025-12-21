import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '@app/common';

@Controller()
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @MessagePattern({ cmd: 'create_appointment' })
    async createAppointment(@Payload() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentService.createAppointment(createAppointmentDto);
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
        return this.appointmentService.updateAppointment(payload.id, payload.updateAppointmentDto);
    }

    @MessagePattern({ cmd: 'delete_appointment' })
    async deleteAppointment(@Payload() id: string) {
        return this.appointmentService.deleteAppointment(id);
    }
}
