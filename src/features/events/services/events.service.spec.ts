import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EventsService } from './events.service';
import { EventsMongoRepository } from '../repositories/mongo/events.repository';

describe('EventsService', () => {
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        ConfigService,
        {
          provide: EventsMongoRepository,
          useValue: {
            createEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(eventsService).toBeDefined();
  });

  describe('onApplicationBootstrap method', () => {
    it('should initialize all the values', () => {
      eventsService.onApplicationBootstrap();
    });
  });

  describe('onApplicationShutdown method', () => {
    it('should initialize all the values', () => {
      eventsService.onApplicationBootstrap();
      eventsService.onApplicationShutdown();
    });
  });
});
