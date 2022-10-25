import { Injectable } from '@nestjs/common';

const test2 = 1;

@Injectable()
export class PublicService {
  checkHealth() {
    return { data: 'NestJS API v1 running' };
  }
}
