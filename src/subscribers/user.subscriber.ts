import { Logger } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities';
import { generateHash } from 'src/util';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  private logger = new Logger(UserSubscriber.name);

  listenTo() {
    return UserEntity;
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    event.entity.password = await generateHash(event.entity.password);
  }

  async afterInsert(event: InsertEvent<UserEntity>) {
    this.logger.log(
      `New User ${event.entity.username} was created at ${event.entity.createdAt}`
    );
  }
}
