import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicService {
  checkHealth() {
    return { data: 'NestJS API v1 running' };
  }
}
