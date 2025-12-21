import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { UpdateUserDto } from '@app/common';

@Controller()
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @MessagePattern({ cmd: 'get_users' })
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @MessagePattern({ cmd: 'get_user_by_id' })
    async getUserById(@Payload() id: string) {
        return this.userService.getUserById(id);
    }

    @MessagePattern({ cmd: 'update_user' })
    async updateUser(@Payload() payload: { id: string, updateUserDto: UpdateUserDto }) {
        return this.userService.updateUser(payload.id, payload.updateUserDto);
    }

    @MessagePattern({ cmd: 'delete_user' })
    async deleteUser(@Payload() id: string) {
        return this.userService.deleteUser(id);
    }
}
