import { Controller, Get, Post, Body, Param, Inject, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAppointmentDto, UpdateAppointmentDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('appointments')
export class AppointmentController {
    constructor(
        @Inject('APPOINTMENT_SERVICE') private readonly appointmentClient: ClientProxy,
    ) { }

    @Get()
    async getAllAppointments() {
        return firstValueFrom(this.appointmentClient.send({ cmd: 'get_all_appointments' }, {}));
    }

    @Get(':id')
    async getAppointmentById(@Param('id') id: string) {
        return firstValueFrom(this.appointmentClient.send({ cmd: 'get_appointment_by_id' }, id));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createAppointment(@Body() createDto: CreateAppointmentDto, @Request() req) {
        console.log('API Gateway: Received createAppointment request', createDto);
        createDto.user = req.user.userId;
        try {
            console.log('API Gateway: Forwarding to APPOINTMENT_SERVICE');
            const result = await firstValueFrom(this.appointmentClient.send({ cmd: 'create_appointment' }, createDto));
            console.log('API Gateway: Received response from APPOINTMENT_SERVICE', result);
            return result;
        } catch (error) {
            console.error('API Gateway: Error forwarding to APPOINTMENT_SERVICE', error);
            throw error;
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateAppointment(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
        console.log(`API Gateway: Request to update appointment ${id}`, updateDto);
        try {
            const result = await firstValueFrom(this.appointmentClient.send({ cmd: 'update_appointment' }, { id, updateAppointmentDto: updateDto }));
            console.log(`API Gateway: Update successful for ${id}`, result);
            return result;
        } catch (error) {
            console.error(`API Gateway: Failed to update appointment ${id}`, error);
            throw error;
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteAppointment(@Param('id') id: string) {
        return firstValueFrom(this.appointmentClient.send({ cmd: 'delete_appointment' }, id));
    }
}
