import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>
  ) {}

  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    await this.assertUserExists(model.email, model.username);
    return Object.assign(new UserEntity(), model);
  }

  private async assertUserExists(
    email: string,
    username: string
  ): Promise<void> {
    const isUser = Boolean(
      await this.repo.findOneBy([
        { email, deleted: false },
        { username, deleted: false },
      ])
    );

    if (isUser) {
      throw new BadRequestException('User already exists.');
    }
  }

  public async deactivateUser(user: UserEntity): Promise<UserEntity> {
    return { ...user, deleted: true };
  }

  public async reactivateUser(user: UserEntity): Promise<UserEntity> {
    return { ...user, deleted: false };
  }
}
