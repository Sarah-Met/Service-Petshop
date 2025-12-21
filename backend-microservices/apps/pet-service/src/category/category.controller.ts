import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@app/common';

@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @MessagePattern({ cmd: 'create_category' })
    async createCategory(@Payload() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @MessagePattern({ cmd: 'get_all_categories' })
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @MessagePattern({ cmd: 'get_category_by_id' })
    async getCategoryById(@Payload() id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @MessagePattern({ cmd: 'update_category' })
    async updateCategory(@Payload() payload: { id: string; updateCategoryDto: UpdateCategoryDto }) {
        return this.categoryService.updateCategory(payload.id, payload.updateCategoryDto);
    }

    @MessagePattern({ cmd: 'delete_category' })
    async deleteCategory(@Payload() id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
