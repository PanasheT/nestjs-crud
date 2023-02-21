import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>
  ) {}

  public async findOneConversation(
    uuid: string,
    deleted: boolean = false
  ): Promise<ConversationEntity> {
    return await this.repo.findOneBy({ uuid, deleted });
  }

  public async findOneConversationOrFail(
    uuid: string,
    deleted: boolean = false
  ): Promise<ConversationEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted });
    } catch {
      throw new NotFoundException(`Conversation with uuid: not ${uuid} found`);
    }
  }

  public async findAllConversations(): Promise<ConversationEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }
}
