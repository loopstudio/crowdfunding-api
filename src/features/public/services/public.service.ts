import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicService {
  checkHealth() {
    return { message: 'NestJS API v1 running' };
  }
}
