import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class CommonSubscriber implements EntitySubscriberInterface {
  public beforeUpdate(event: UpdateEvent<any>): void {
    event.entity.updatedAt = new Date();
  }
}
