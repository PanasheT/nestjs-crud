import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { CreateMessageDto, UpdateMessageDto } from '../dtos';
import { ConversationEntity, MessageEntity } from '../entities';

@Injectable()
export class MessageFactory {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepo: Repository<ConversationEntity>
  ) {}

  public createInitialMessageForConversation(
    text: string,
    sender: UserEntity
  ): MessageEntity {
    return Object.assign(new MessageEntity(), { sender, text });
  }

  public async createMessage(model: CreateMessageDto): Promise<MessageEntity> {
    const [conversation, sender] = await Promise.all([
      this.findOneConversationOrFail(model.conversationUUID),
      this.userService.findOneUserOrFail(model.senderUUID, 'uuid'),
    ]);

    this.assertSenderBelongsToConversation(model.senderUUID, conversation);

    const text: string = model.text.trim();

    return Object.assign(new MessageEntity(), { conversation, sender, text });
  }

  private async findOneConversationOrFail(
    conversationUUID: string
  ): Promise<ConversationEntity> {
    try {
      return await this.conversationRepo.findOneByOrFail({
        uuid: conversationUUID,
        deleted: false,
      });
    } catch {
      throw new NotFoundException(
        `Conversation with uuid: ${conversationUUID} not found`
      );
    }
  }

  private assertSenderBelongsToConversation(
    senderUUID: string,
    conversation: ConversationEntity
  ): void {
    if (
      conversation.sender.uuid !== senderUUID &&
      conversation.recipient.uuid !== senderUUID
    ) {
      throw new ForbiddenException();
    }
  }

  public updateMessage(
    model: UpdateMessageDto,
    message: MessageEntity
  ): MessageEntity {
    if (model.text === message.text) {
      throw new BadRequestException('No changes made.');
    }

    return Object.assign(message, model);
  }
}
