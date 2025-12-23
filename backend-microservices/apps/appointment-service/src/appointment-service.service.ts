import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
