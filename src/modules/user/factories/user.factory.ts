import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>
  ) {}

  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    await this.assertUserExists(model.email, model.username);

    const user: UserEntity = Object.assign(new UserEntity(), { ...model });

    return user;
  }

  private async assertUserExists(
    email: string,
    username: string
  ): Promise<void> {
    const isUser: boolean = Boolean(
      await this.repo.findOneBy([
        { email, deleted: false },
        { username, deleted: false },
      ])
    );

    if (isUser) {
      throw new BadRequestException('User already exists.');
    }
  }
}
