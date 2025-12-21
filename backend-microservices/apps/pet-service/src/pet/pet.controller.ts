import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from '@app/common';

@Controller()
export class PetController {
    constructor(private readonly petService: PetService) { }

    @MessagePattern({ cmd: 'create_pet' })
    async createPet(@Payload() createPetDto: CreatePetDto) {
        return this.petService.createPet(createPetDto);
    }

    @MessagePattern({ cmd: 'get_all_pets' })
    async getAllPets() {
        return this.petService.getAllPets();
    }

    @MessagePattern({ cmd: 'get_pet_by_id' })
    async getPetById(@Payload() id: string) {
        return this.petService.getPetById(id);
    }

    @MessagePattern({ cmd: 'update_pet' })
    async updatePet(@Payload() payload: { id: string; updatePetDto: UpdatePetDto }) {
        return this.petService.updatePet(payload.id, payload.updatePetDto);
    }

    @MessagePattern({ cmd: 'delete_pet' })
    async deletePet(@Payload() id: string) {
        return this.petService.deletePet(id);
    }

    // --- Products ---

    @MessagePattern({ cmd: 'update_product' })
    async updateProduct(@Payload() payload: { id: string; updateProductDto: any }) {
        return this.petService.updateProduct(payload.id, payload.updateProductDto);
    }

    @MessagePattern({ cmd: 'delete_product' })
    async deleteProduct(@Payload() id: string) {
        return this.petService.deleteProduct(id);
    }

    // --- Categories ---

    @MessagePattern({ cmd: 'update_category' })
    async updateCategory(@Payload() payload: { id: string; updateCategoryDto: any }) {
        return this.petService.updateCategory(payload.id, payload.updateCategoryDto);
    }

    @MessagePattern({ cmd: 'delete_category' })
    async deleteCategory(@Payload() id: string) {
        return this.petService.deleteCategory(id);
    }
}
