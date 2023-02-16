import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityService } from 'src/util';
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
  ) {}

  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    const { email, username, password, lastName, firstName, ...profileDto } =
      model;

    await this.assertUserExists({ email, username });

    const profile: ProfileEntity = this.getProfileFromFactory(profileDto);

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

  private getProfileFromFactory(model: CreateProfileDto): ProfileEntity {
    try {
      return this.profileFactroy.createProfile(model);
    } catch (error) {
      console.log(error);
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
