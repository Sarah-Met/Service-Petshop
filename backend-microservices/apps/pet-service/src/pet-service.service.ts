import { Injectable } from '@nestjs/common';

@Injectable()
export class PetServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
