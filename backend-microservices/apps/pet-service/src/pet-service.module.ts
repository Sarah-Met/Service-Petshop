import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PetModule } from './pet/pet.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

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
    PetModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class PetServiceModule { }
