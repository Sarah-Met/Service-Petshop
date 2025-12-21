import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PetController } from './pet.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PET_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1',
                    port: 4002,
                },
            },
        ]),
    ],
    controllers: [PetController],
})
export class PetModule { }
