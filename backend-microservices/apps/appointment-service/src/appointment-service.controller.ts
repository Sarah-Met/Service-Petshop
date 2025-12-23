import { Controller, Get } from '@nestjs/common';
import { AppointmentServiceService } from './appointment-service.service';

@Controller()
export class AppointmentServiceController {
  constructor(private readonly appointmentServiceService: AppointmentServiceService) {}

  @Get()
  getHello(): string {
    return this.appointmentServiceService.getHello();
  }
}
