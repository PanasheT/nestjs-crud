import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>
  ) {}
}
