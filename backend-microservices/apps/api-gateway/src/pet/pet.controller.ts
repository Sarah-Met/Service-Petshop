import { Controller, Get, Post, Put, Delete, Body, Param, Inject, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePetDto, UpdatePetDto, CreateProductDto, CreateCategoryDto } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Note: File interceptors here are just for endpoint definition. files need proper handling.
// For now, assume file upload returns a path string or we handle it here and pass path to service.

@Controller()
export class PetController {
    constructor(
        @Inject('PET_SERVICE') private readonly petClient: ClientProxy,
    ) { }

    // --- Pets ---
    @Get('pets')
    async getAllPets() {
        return firstValueFrom(this.petClient.send({ cmd: 'get_all_pets' }, {}));
    }

    @Get('pets/:id')
    async getPetById(@Param('id') id: string) {
        return firstValueFrom(this.petClient.send({ cmd: 'get_pet_by_id' }, id));
    }

    @Post('pets')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/pets',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async createPet(@Body() createPetDto: CreatePetDto, @UploadedFile() file: any) {
        if (file) {
            createPetDto.image = `/uploads/pets/${file.filename}`;
        }
        return firstValueFrom(this.petClient.send({ cmd: 'create_pet' }, createPetDto));
    }

    @Put('pets/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/pets',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async updatePet(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto, @UploadedFile() file: any) {
        if (file) {
            updatePetDto.image = `/uploads/pets/${file.filename}`;
        }
        return firstValueFrom(this.petClient.send({ cmd: 'update_pet' }, { id, updatePetDto }));
    }

    @Delete('pets/:id')
    async deletePet(@Param('id') id: string) {
        return firstValueFrom(this.petClient.send({ cmd: 'delete_pet' }, id));
    }

    // --- Products ---
    @Get('products')
    async getAllProducts() {
        return firstValueFrom(this.petClient.send({ cmd: 'get_all_products' }, {}));
    }

    @Get('products/:id')
    async getProductById(@Param('id') id: string) {
        return firstValueFrom(this.petClient.send({ cmd: 'get_product_by_id' }, id));
    }

    @Post('products')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async createProduct(@Body() createDto: CreateProductDto, @UploadedFile() file: any) {
        if (file) {
            createDto.image = `/uploads/products/${file.filename}`;
        }
        return firstValueFrom(this.petClient.send({ cmd: 'create_product' }, createDto));
    }

    // --- Categories ---
    @Get('categories')
    async getAllCategories() {
        return firstValueFrom(this.petClient.send({ cmd: 'get_all_categories' }, {}));
    }

    @Post('categories')
    async createCategory(@Body() createDto: CreateCategoryDto) {
        return firstValueFrom(this.petClient.send({ cmd: 'create_category' }, createDto));
    }

    @Put('products/:id')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    async updateProduct(@Param('id') id: string, @Body() updateDto: any, @UploadedFile() file: any) {
        if (file) {
            updateDto.image = `/uploads/products/${file.filename}`;
        }
        return firstValueFrom(this.petClient.send({ cmd: 'update_product' }, { id, updateProductDto: updateDto }));
    }

    @Delete('products/:id')
    async deleteProduct(@Param('id') id: string) {
        return firstValueFrom(this.petClient.send({ cmd: 'delete_product' }, id));
    }

    @Put('categories/:id')
    async updateCategory(@Param('id') id: string, @Body() updateDto: any) {
        return firstValueFrom(this.petClient.send({ cmd: 'update_category' }, { id, updateCategoryDto: updateDto }));
    }

    @Delete('categories/:id')
    async deleteCategory(@Param('id') id: string) {
        return firstValueFrom(this.petClient.send({ cmd: 'delete_category' }, id));
    }
}
