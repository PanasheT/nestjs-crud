import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { MessageEntity } from '../entities';

@Injectable()
export class MessageFactory {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repo: Repository<MessageEntity>,
    private readonly userService: UserService
  ) {}

  public createInitialMessageForConversation(
    text: string,
    sender: UserEntity
  ): MessageEntity {
    return Object.assign(new MessageEntity(), { sender, text });
  }
}
