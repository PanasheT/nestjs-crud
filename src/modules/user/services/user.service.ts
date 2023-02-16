import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserFactory } from '../factories';
import {
  FindUserQuery,
  UserIdentificationProperties as UserIdProps,
} from '../types';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly factory: UserFactory
  ) {}

  public async findOneUser(
    value: string,
    prop: UserIdProps
  ): Promise<UserEntity> {
    const query: FindUserQuery = this.generateFindQuery(value, prop);
    return query ? this.repo.findOneBy(query) : undefined;
  }

  public async findAllUsers(): Promise<UserEntity[]> {
    return this.repo.findBy({ deleted: false });
  }

  public async findOneUserOrFail(
    value: string,
    prop: UserIdProps
  ): Promise<UserEntity> {
    try {
      const query: FindUserQuery = this.generateFindQuery(value, prop);
      console.log(query);
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('User not found.');
    }
  }

  private generateFindQuery(
    value: string,
    prop: UserIdProps,
    deleted = false
  ): FindUserQuery {
    return { [prop]: value, deleted };
  }

  public async createUser(model: CreateUserDto): Promise<UserEntity> {
    return await this.handleUserCreation(await this.getUserFromFactory(model));
  }

  private async getUserFromFactory(model: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.factory.createUser(model);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  private async handleUserCreation(model: UserEntity): Promise<UserEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create user.');
    }
  }
}
