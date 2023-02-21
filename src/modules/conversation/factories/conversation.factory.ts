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
    sourceUUID,
    targetUUID,
    messageText,
  }: CreateConversationDto): Promise<ConversationEntity> {
    await this.assertConversationExists(sourceUUID, targetUUID);

    const [source, target] = await Promise.all([
      await this.userService.findOneUserOrFail(sourceUUID, 'uuid'),
      await this.userService.findOneUserOrFail(targetUUID, 'uuid'),
    ]);

    const messages: MessageEntity[] = [
      this.getInitialMessageFromFactory(messageText, source),
    ];

    return Object.assign(new ConversationEntity(), {
      source,
      target,
      messages,
    });
  }

  private async assertConversationExists(
    sourceUUID: string,
    targetUUID: string
  ): Promise<void> {
    const query = [
      {
        source: { uuid: sourceUUID },
        target: { uuid: targetUUID },
        deleted: false,
      },
      {
        source: { uuid: targetUUID },
        target: { uuid: sourceUUID },
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
    source: UserEntity
  ): MessageEntity {
    try {
      return this.messageFactory.createInitialMessageForConversation(
        text,
        source
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to create opening message of conversation.'
      );
    }
  }
}
