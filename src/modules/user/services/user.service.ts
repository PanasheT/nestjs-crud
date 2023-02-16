import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { UserFactory } from '../factories';
import {
  FindUserQuery,
  UserIdentificationProperties as UserIdProps,
} from '../types';

@Injectable()
export class UserService {
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
      return query ? this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('User not found.');
    }
  }

  private generateFindQuery(
    value: string,
    prop: UserIdProps,
    deleted: boolean = false
  ): FindUserQuery {
    return { [prop]: value, deleted };
  }
}
