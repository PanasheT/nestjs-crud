import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'message' })
export class MessageEntity extends AbstractEntity {}
