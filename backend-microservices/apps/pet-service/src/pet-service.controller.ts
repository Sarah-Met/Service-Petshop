import { Controller, Get } from '@nestjs/common';
import { PetServiceService } from './pet-service.service';

@Controller()
export class PetServiceController {
  constructor(private readonly petServiceService: PetServiceService) {}

  @Get()
  getHello(): string {
    return this.petServiceService.getHello();
  }
}
