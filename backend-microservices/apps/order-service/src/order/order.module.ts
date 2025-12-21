import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema, User, UserSchema, Product, ProductSchema } from '@app/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: User.name, schema: UserSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
