import { Test, TestingModule } from '@nestjs/testing';
import { InitializationsService } from './initializations.service';

describe('InitializationsService', () => {
  let service: InitializationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializationsService],
    }).compile();

    service = module.get<InitializationsService>(InitializationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
