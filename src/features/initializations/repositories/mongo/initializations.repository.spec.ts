import { Test, TestingModule } from '@nestjs/testing';
import { InitializationsMongoRepository } from './initializations.repository';

describe('MongoService', () => {
  let service: InitializationsMongoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializationsMongoRepository],
    }).compile();

    service = module.get<InitializationsMongoRepository>(
      InitializationsMongoRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
