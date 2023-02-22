import { AbstractEntity } from 'src/common';
import { ConversationEntity } from 'src/modules/conversation/entities';
import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'message' })
export class MessageEntity extends AbstractEntity {
  @Column()
  text: string;

  @ManyToOne(() => UserEntity, { eager: true })
  sender: UserEntity;

  @ManyToOne(
    () => ConversationEntity,
    (conversation: ConversationEntity) => conversation.messages,
    { eager: true }
  )
  @JoinColumn()
  conversation: ConversationEntity;
}
