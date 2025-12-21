import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema, User, UserSchema, Pet, PetSchema } from '@app/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Appointment.name, schema: AppointmentSchema },
            { name: User.name, schema: UserSchema },
            { name: Pet.name, schema: PetSchema },
        ]),
    ],
    controllers: [AppointmentController],
    providers: [AppointmentService],
    exports: [AppointmentService],
})
export class AppointmentModule { }
