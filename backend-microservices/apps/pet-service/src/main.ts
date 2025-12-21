import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PetServiceModule } from './pet-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PetServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4002,
      },
    },
  );
  await app.listen();
  console.log('Pet Microservice is listening on port 4002');
}
bootstrap();
