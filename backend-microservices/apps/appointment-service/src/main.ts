import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppointmentServiceModule } from './appointment-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppointmentServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4004,
      },
    },
  );
  await app.listen();
  console.log('Appointment Microservice is listening on port 4004');
}
bootstrap();
