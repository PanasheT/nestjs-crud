import { AbstractEntity } from 'src/common';
import { MessageEntity } from 'src/modules/message/entities';
import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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

  @OneToMany(
    () => MessageEntity,
    (message: MessageEntity) => message.conversation,
    { eager: true, cascade: true }
  )
  messages: MessageEntity[];
}
