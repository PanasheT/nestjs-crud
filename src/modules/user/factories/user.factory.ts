import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityService } from 'src/util';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { FindUserQuery } from '../types';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>
  ) {}

  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    const { email, username } = model;
    await this.assertUserExists({ email, username });
    return Object.assign(new UserEntity(), model);
  }

  private async assertUserExists(model: {
    email?: string;
    username?: string;
  }): Promise<void> {
    const query: FindUserQuery[] = [
      model.email && { email: model.email, deleted: false },
      model.username && { username: model.username, deleted: false },
    ].filter(Boolean);

    if (Boolean(await this.repo.findOneBy(query))) {
      throw new BadRequestException('User already exists.');
    }
  }

  public async deactivateUser(user: UserEntity): Promise<UserEntity> {
    user.deleted = true;
    return user;
  }

  public async reactivateUser(user: UserEntity): Promise<UserEntity> {
    user.deleted = false;
    return user;
  }

  public async updateUser(
    model: UpdateUserDto,
    user: UserEntity
  ): Promise<UserEntity> {
    const update: Partial<UserEntity> = UtilityService.validateUpdate(
      user,
      model
    );

    if (Object.entries(update).length === 0) {
      throw new BadRequestException('Update has no changes.');
    }

    if (update.email) {
      await this.assertUserExists({ email: update.email });
    }

    Object.assign(user, update);
    return user;
  }
}
