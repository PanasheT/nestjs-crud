import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'conversation' })
export class ConversationEntity extends AbstractEntity {}
