import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dtos';
import { MessageEntity } from '../entities';
import { MessageFactory } from '../factories';

@Injectable()
export class MessageService {
  private logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(MessageEntity)
    private readonly repo: Repository<MessageEntity>,
    private readonly factory: MessageFactory
  ) {}

  public async findOneMessage(uuid: string): Promise<MessageEntity> {
    return await this.repo.findOneBy({ uuid, deleted: false });
  }

  public async findOneMessageOrFail(uuid: string): Promise<MessageEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted: false });
    } catch {
      throw new NotFoundException('Message not found.');
    }
  }

  public async findAllMessages(): Promise<MessageEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async findAllMessagesInConversation(
    conversationUUID: string
  ): Promise<MessageEntity[]> {
    const query = {
      conversation: { uuid: conversationUUID },
      deleted: false,
    };

    return (await this.repo.findBy(query)) || [];
  }

  public async createMessage(model: CreateMessageDto): Promise<MessageEntity> {
    return await this.handleMessageSave(
      await this.getMessageFromFactory(model)
    );
  }

  private async getMessageFromFactory(
    model: CreateMessageDto
  ): Promise<MessageEntity> {
    try {
      return await this.factory.createMessage(model);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleMessageSave(
    model: MessageEntity
  ): Promise<MessageEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to save message.');
    }
  }
}
