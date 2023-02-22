import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateMessageDto, UpdateMessageDto } from '../dtos';
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

  public async updateMessage(
    uuid: string,
    model: UpdateMessageDto
  ): Promise<MessageEntity> {
    const message: MessageEntity = await this.findOneMessageOrFail(uuid);
    const updatedMessage: MessageEntity = this.getUpdatedMessageFromFactory(
      model,
      message
    );

    await this.handleMessageUpdate(uuid, updatedMessage);
    return updatedMessage;
  }

  private getUpdatedMessageFromFactory(
    model: UpdateMessageDto,
    message: MessageEntity
  ): MessageEntity {
    try {
      return this.factory.updateMessage(model, message);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleMessageUpdate(
    uuid: string,
    model: UpdateMessageDto
  ): Promise<UpdateResult> {
    try {
      return await this.repo
        .createQueryBuilder()
        .update()
        .set(model)
        .where('uuid = :uuid', { uuid })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update Message.');
    }
  }

  public async permanentlyDeleteMessage(uuid: string): Promise<void> {
    await this.findOneMessageOrFail(uuid);
    await this.handleMessageDelete(uuid);
  }

  private async handleMessageDelete(uuid: string): Promise<DeleteResult> {
    try {
      return await this.repo
        .createQueryBuilder()
        .delete()
        .where('uuid = :uuid', { uuid })
        .execute();
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to delete message.');
    }
  }

  public async findMessagesWithinDateRange(
    senderUUID: string,
    startDate: Date,
    endDate: Date = new Date()
  ): Promise<[MessageEntity[], number]> {
    if (startDate === endDate) {
      return [[], 0];
    }

    let query = this.repo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.profile', 'profile')
      .where('sender.uuid = :senderUUID', { senderUUID })
      .andWhere('message.createdAt >= :startDate', { startDate });

    if (endDate > startDate) {
      query = query.andWhere('message.createdAt <= :endDate', { endDate });
    } else {
      query = query
        .andWhere('message.createdAt <= :startDate', { startDate })
        .andWhere('message.createdAt >= :endDate', { endDate });
    }

    return await query.getManyAndCount();
  }
}
