import { Controller, Get, Put, Delete, Body, Param, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) { }

    @Get()
    async getAllUsers() {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'get_users' }, {}));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'get_user_by_id' }, id));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'update_user' }, { id, updateUserDto }));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'delete_user' }, id));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
