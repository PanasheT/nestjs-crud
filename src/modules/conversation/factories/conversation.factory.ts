import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { CreateConversationDto } from '../dtos';
import { ConversationEntity } from '../entities';

@Injectable()
export class ConversationFactory {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>,
    private readonly userService: UserService
  ) {}

  public async createConversation({
    sourceUUID,
    targetUUID,
    messageText,
  }: CreateConversationDto): Promise<ConversationEntity> {
    await this.assertConversationExists(sourceUUID, targetUUID);

    const source: UserEntity = await this.userService.findOneUserOrFail(
      sourceUUID,
      'uuid'
    );

    const target: UserEntity = await this.userService.findOneUserOrFail(
      targetUUID,
      'uuid'
    );

    return;
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
}
