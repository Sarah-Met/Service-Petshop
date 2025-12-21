import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UsersController],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule { }
