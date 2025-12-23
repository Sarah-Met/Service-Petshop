import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';

describe('AppointmentServiceController', () => {
  let appointmentServiceController: AppointmentServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentServiceController],
      providers: [AppointmentServiceService],
    }).compile();

    appointmentServiceController = app.get<AppointmentServiceController>(AppointmentServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appointmentServiceController.getHello()).toBe('Hello World!');
    });
  });
});
