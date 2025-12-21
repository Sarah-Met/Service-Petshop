import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/pet-app',
        family: 4, // Force IPv4
      }),
      inject: [ConfigService],
    }),
    OrderModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class OrderServiceModule { }
