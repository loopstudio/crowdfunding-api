import { Test, TestingModule } from '@nestjs/testing';
import { EventsMongoRepository } from './events.repository';

describe('MongoService', () => {
  let service: EventsMongoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsMongoRepository],
    }).compile();

    service = module.get<EventsMongoRepository>(EventsMongoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
