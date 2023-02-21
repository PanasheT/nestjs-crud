import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { MessageFactory } from '.';
import { CreateConversationDto } from '../dtos';
import { ConversationEntity, MessageEntity } from '../entities';

@Injectable()
export class ConversationFactory {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>,
    private readonly userService: UserService,
    private readonly messageFactory: MessageFactory
  ) {}

  public async createConversation({
    senderUUID,
    recipientUUID,
    messageText,
  }: CreateConversationDto): Promise<ConversationEntity> {
    await this.assertConversationExists(senderUUID, recipientUUID);

    const [sender, recipient] = await Promise.all([
      await this.userService.findOneUserOrFail(senderUUID, 'uuid'),
      await this.userService.findOneUserOrFail(recipientUUID, 'uuid'),
    ]);

    const messages: MessageEntity[] = [
      this.getInitialMessageFromFactory(messageText, sender),
    ];

    return Object.assign(new ConversationEntity(), {
      sender,
      recipient,
      messages,
    });
  }

  private async assertConversationExists(
    senderUUID: string,
    recipientUUID: string
  ): Promise<void> {
    const query = [
      {
        sender: { uuid: senderUUID },
        recipient: { uuid: recipientUUID },
        deleted: false,
      },
      {
        sender: { uuid: recipientUUID },
        recipient: { uuid: senderUUID },
        deleted: false,
      },
    ];

    const conversation: ConversationEntity = await this.repo.findOneBy(query);

    if (conversation) {
      throw new NotAcceptableException('Conversation already exists.');
    }
  }

  private getInitialMessageFromFactory(
    text: string,
    sender: UserEntity
  ): MessageEntity {
    try {
      return this.messageFactory.createInitialMessageForConversation(
        text,
        sender
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to create opening message of conversation.'
      );
    }
  }
}
