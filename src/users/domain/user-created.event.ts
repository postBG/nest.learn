import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from '../application/event/cqrs-event';

export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(readonly email: string, readonly signupVerifyToken: string) {
    super(UserCreatedEvent.name);
  }
}
