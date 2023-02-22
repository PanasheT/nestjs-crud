import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from '../dtos';
import { ConversationEntity } from '../entities';
import { ConversationFactory } from '../factories';

@Injectable()
export class ConversationService {
  private logger = new Logger(ConversationService.name);

  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>,
    private readonly factory: ConversationFactory
  ) {}

  public async findOneConversation(
    uuid: string,
    deleted = false
  ): Promise<ConversationEntity> {
    return await this.repo.findOneBy({ uuid, deleted });
  }

  public async findOneConversationOrFail(
    uuid: string,
    deleted = false
  ): Promise<ConversationEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted });
    } catch {
      throw new NotFoundException(`Conversation with uuid: ${uuid} not found`);
    }
  }

  public async findAllConversations(): Promise<ConversationEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async createConversation(
    model: CreateConversationDto
  ): Promise<ConversationEntity> {
    return await this.handleConversationSave(
      await this.getConversationFromFactory(model)
    );
  }

  private async getConversationFromFactory(
    model: CreateConversationDto
  ): Promise<ConversationEntity> {
    try {
      return await this.factory.createConversation(model);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  private async handleConversationSave(
    model: ConversationEntity
  ): Promise<ConversationEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to save conversation.');
    }
  }
}
