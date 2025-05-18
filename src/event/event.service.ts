import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEventTopic, AppEventPayload } from '@autonomous/shared/types';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit<T extends AppEventTopic>(topic: T, payload: AppEventPayload<T>) {
    this.eventEmitter.emit(topic, payload);
  }
}
