import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ORDER_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: '127.0.0.1',
                    port: 4003,
                },
            },
        ]),
    ],
    controllers: [OrderController],
})
export class OrderModule { }
