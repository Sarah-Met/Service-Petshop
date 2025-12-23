import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseInterceptors, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto, CreateAppointmentDto, UpdateAppointmentDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller()
export class OrderController {
    constructor(
        @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    ) { }

    // --- Orders ---
    @Get('orders')
    async getAllOrders() {
        return firstValueFrom(this.orderClient.send({ cmd: 'get_all_orders' }, {}));
    }

    @Get('orders/:id')
    async getOrderById(@Param('id') id: string) {
        return firstValueFrom(this.orderClient.send({ cmd: 'get_order_by_id' }, id));
    }

    @Post('orders')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'adoptionAgreement', maxCount: 1 }
    ], {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            }
        })
    }))
    async createOrder(@Body() createDto: CreateOrderDto, @UploadedFiles() files: any, @Request() req) {
        console.log('DEBUG: req.user:', req.user);
        console.log('DEBUG: Initial createDto:', createDto);

        if (files && files.adoptionAgreement && files.adoptionAgreement.length > 0) {
            // Store the relative path string in the DTO
            createDto.adoptionAgreement = `/uploads/${files.adoptionAgreement[0].filename}`;
        }
        createDto.user = req.user?.userId;

        console.log('DEBUG: Final createDto being sent:', createDto);
        return firstValueFrom(this.orderClient.send({ cmd: 'create_order' }, createDto));
    }

    @Put('orders/:id')
    @UseGuards(JwtAuthGuard)
    async updateOrder(@Param('id') id: string, @Body() updateDto: UpdateOrderDto) {
        return firstValueFrom(this.orderClient.send({ cmd: 'update_order' }, { id, updateOrderDto: updateDto }));
    }

    @Delete('orders/:id')
    @UseGuards(JwtAuthGuard)
    async deleteOrder(@Param('id') id: string) {
        return firstValueFrom(this.orderClient.send({ cmd: 'delete_order' }, id));
    }


}
