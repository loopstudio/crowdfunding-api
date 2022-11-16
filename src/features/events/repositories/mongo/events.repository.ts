import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Event, EventDocument } from '../../schemas/event.schema';
import { CreateEventDto } from '../../dto/create-event.dto';

@Injectable()
export class EventsMongoRepository {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(body: CreateEventDto): Promise<Event> {
    const { event, blockNumber, blockHash, transactionHash, data } = body;

    const savedEvent = await this.eventModel.create({
      event,
      blockNumber,
      blockHash,
      transactionHash,
      data,
      date: new Date(),
    });

    return savedEvent;
  }
}
