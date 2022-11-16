/* eslint-disable @typescript-eslint/no-explicit-any */

import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { Event } from '../../schemas/event.schema';
import { createdEvent, createEventDto } from '../../tests/mocks';
import { EventsMongoRepository } from './events.repository';

describe('MongoService', () => {
  let eventRepository: EventsMongoRepository;
  let eventModel: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsMongoRepository,
        {
          provide: getModelToken(Event.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    eventModel = module.get<Model<Event>>(getModelToken(Event.name));
    eventRepository = module.get<EventsMongoRepository>(EventsMongoRepository);
  });

  it('should be defined', () => {
    expect(eventRepository).toBeDefined();
  });

  describe('createEvent method', () => {
    it('should create an event with no error', async () => {
      jest.spyOn(eventModel, 'create').mockReturnValue(createdEvent as any);

      const response = await eventRepository.createEvent(createEventDto);

      console.log(response);

      expect(response).toStrictEqual(createdEvent);
    });
  });
});
