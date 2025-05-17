import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEventTopic, EventPayload } from '@autonomous/shared/types';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit<T extends AppEventTopic>(topic: T, payload: EventPayload<T>) {
    this.eventEmitter.emit(topic, payload);
  }
}
