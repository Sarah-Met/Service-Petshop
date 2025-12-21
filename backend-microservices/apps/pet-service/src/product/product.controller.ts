import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from '@app/common';

@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @MessagePattern({ cmd: 'create_product' })
    async createProduct(@Payload() createProductDto: CreateProductDto) {
        return this.productService.createProduct(createProductDto);
    }

    @MessagePattern({ cmd: 'get_all_products' })
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @MessagePattern({ cmd: 'get_product_by_id' })
    async getProductById(@Payload() id: string) {
        return this.productService.getProductById(id);
    }

    @MessagePattern({ cmd: 'update_product' })
    async updateProduct(@Payload() payload: { id: string; updateProductDto: UpdateProductDto }) {
        return this.productService.updateProduct(payload.id, payload.updateProductDto);
    }

    @MessagePattern({ cmd: 'delete_product' })
    async deleteProduct(@Payload() id: string) {
        return this.productService.deleteProduct(id);
    }
}
