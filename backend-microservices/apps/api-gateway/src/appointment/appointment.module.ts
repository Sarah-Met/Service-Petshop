import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppointmentController } from './appointment.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'APPOINTMENT_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1', // Or appointment-service hostname if dockerized
                    port: 4004,
                },
            },
        ]),
    ],
    controllers: [AppointmentController],
})
export class AppointmentModule { }
