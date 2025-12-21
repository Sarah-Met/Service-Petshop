import { Test, TestingModule } from '@nestjs/testing';
import { PetServiceController } from './pet-service.controller';
import { PetServiceService } from './pet-service.service';

describe('PetServiceController', () => {
  let petServiceController: PetServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PetServiceController],
      providers: [PetServiceService],
    }).compile();

    petServiceController = app.get<PetServiceController>(PetServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(petServiceController.getHello()).toBe('Hello World!');
    });
  });
});
