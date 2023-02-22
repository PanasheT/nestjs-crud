import { AbstractEntity } from 'src/common';
import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity({ name: 'conversation' })
export class ConversationEntity extends AbstractEntity {
  @Column({ default: 'NOW()' })
  lastMessage: Date;

  @Column({ default: false })
  receiptStatus: boolean;

  @ManyToOne(() => UserEntity, { eager: true })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  recipient: UserEntity;

  @OneToMany(
    () => MessageEntity,
    (message: MessageEntity) => message.conversation,
    { cascade: true }
  )
  messages: MessageEntity[];
}
