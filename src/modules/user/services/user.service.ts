import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
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
    prop: UserIdProps,
    deleted = false
  ): Promise<UserEntity> {
    try {
      const query: FindUserQuery = this.generateFindQuery(value, prop, deleted);
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

  public async deleteUser(uuid: string): Promise<void> {
    await this.findOneUserOrFail(uuid, 'uuid');
    await this.handleUserDeletion(uuid);
  }

  private async handleUserDeletion(uuid: string): Promise<void> {
    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .where('uuid = :uuid', { uuid })
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  public async deactivateUser(uuid: string): Promise<UserEntity> {
    const user: UserEntity = await this.findOneUserOrFail(uuid, 'uuid');
    const deactivatedUser: UserEntity = await this.factory.deactivateUser(user);

    return await this.handleUserCreation(deactivatedUser);
  }

  public async reactivateUser(uuid: string): Promise<UserEntity> {
    const user: UserEntity = await this.findOneUserOrFail(uuid, 'uuid', true);
    const reactivatedUser: UserEntity = await this.factory.reactivateUser(user);

    return await this.handleUserCreation(reactivatedUser);
  }

  public async updateUser(
    uuid: string,
    model: UpdateUserDto
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneUserOrFail(uuid, 'uuid');

    return await this.handleUserCreation(
      await this.getUpdatedUserFromFactory(user, model)
    );
  }

  private async getUpdatedUserFromFactory(
    user: UserEntity,
    model: UpdateUserDto
  ): Promise<UserEntity> {
    try {
      return await this.factory.updateUser(model, user);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async updateUserPassword(
    uuid: string,
    password: string
  ): Promise<void> {
    try {
      await this.repo
        .createQueryBuilder()
        .update()
        .set({ password })
        .where('uuid = :uuid', { uuid })
        .execute();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update password.');
    }
  }
}
