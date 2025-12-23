import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pet/pet.module';
import { OrderModule } from './order/order.module';
import { AppointmentModule } from './appointment/appointment.module';

import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '../uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    PetModule,
    OrderModule,
    AppointmentModule,

  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
