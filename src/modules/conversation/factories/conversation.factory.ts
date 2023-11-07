import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateConversationDto } from '../dtos';
import { ConversationEntity, MessageEntity } from '../entities';
import { MessageFactory } from './message.factory';

@Injectable()
export class ConversationFactory {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>,
    private readonly userService: UserService,
    private readonly messageFactory: MessageFactory
  ) {
    this.logger = new Logger(ConversationFactory.name);
  }

  private readonly logger: Logger;

  public async createConversation({
    senderUUID,
    recipientUUID,
    messageText,
  }: CreateConversationDto): Promise<ConversationEntity> {
    await this.assertConversationExists(senderUUID, recipientUUID);

    const [sender, recipient] = await Promise.all([
      this.userService.findOneUserOrFail(senderUUID, 'uuid'),
      this.userService.findOneUserOrFail(recipientUUID, 'uuid'),
    ]);

    const initialMessage: MessageEntity = this.getInitialMessageFromFactory(
      messageText,
      sender
    );

    return Object.assign(new ConversationEntity(), {
      sender,
      recipient,
      messages: [initialMessage],
    });
  }

  private async assertConversationExists(
    senderUUID: string,
    recipientUUID: string
  ): Promise<void> {
    const query: FindOptionsWhere<ConversationEntity>[] = [
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
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException(
        'Failed to create opening message of conversation.'
      );
    }
  }
}
