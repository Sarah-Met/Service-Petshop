import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from '@app/common';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @MessagePattern({ cmd: 'create_order' })
    async createOrder(@Payload() createOrderDto: CreateOrderDto) {
        return this.orderService.createOrder(createOrderDto);
    }

    @MessagePattern({ cmd: 'get_all_orders' })
    async getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @MessagePattern({ cmd: 'get_order_by_id' })
    async getOrderById(@Payload() id: string) {
        return this.orderService.getOrderById(id);
    }

    @MessagePattern({ cmd: 'update_order' })
    async updateOrder(@Payload() payload: { id: string; updateOrderDto: UpdateOrderDto }) {
        return this.orderService.updateOrder(payload.id, payload.updateOrderDto);
    }

    @MessagePattern({ cmd: 'delete_order' })
    async deleteOrder(@Payload() id: string) {
        return this.orderService.deleteOrder(id);
    }
}
