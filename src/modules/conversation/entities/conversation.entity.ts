import { AbstractEntity } from 'src/common';
import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'conversation' })
export class ConversationEntity extends AbstractEntity {
  @Column({ default: 'NOW()' })
  lastMessage: Date;

  @Column({ default: false })
  receiptStatus: boolean;

  @ManyToOne(() => UserEntity, { eager: true })
  source: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  target: UserEntity;
}
