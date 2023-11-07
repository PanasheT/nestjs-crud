import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { CreateProfileDto, CreateUserDto, UpdateUserDto } from '../dtos';
import { ProfileEntity, UserEntity } from '../entities';
import { FindUserQuery } from '../types';
import { ProfileFactory } from './profile.factory';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly profileFactroy: ProfileFactory
  ) {
    this.logger = new Logger(UserFactory.name);
  }

  private readonly logger: Logger;
  
  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    const { email, username, password, lastName, firstName, ...profileDto } =
      model;

    await this.assertUserExists({ email, username });

    const profile: ProfileEntity = this.getProfileFromFactory(
      profileDto,
      email
    );

    return Object.assign(new UserEntity(), {
      email,
      username,
      password,
      lastName,
      firstName,
      profile,
    });
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

  private getProfileFromFactory(
    model: CreateProfileDto,
    email: string
  ): ProfileEntity {
    try {
      return this.profileFactroy.createProfile(model, email);
    } catch (error) {
      this.logger.error(error?.message);
      throw new InternalServerErrorException('Failed to create profile.');
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
    const update: Partial<UserEntity> = validateUpdate(user, model);

    if (update.email) {
      await this.assertUserExists({ email: update.email });
    }

    return Object.assign(user, update);
  }
}
