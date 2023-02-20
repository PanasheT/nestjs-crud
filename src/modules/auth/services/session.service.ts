import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly userService: UserService
  ) {}

  public async getSessionUser(): Promise<UserEntity> {
    const { uuid } = this.request?.user as UserDto;

    if (!uuid || !isUUID(uuid)) {
      throw new UnauthorizedException();
    }

    const user: UserEntity = await this.userService.findOneUser(uuid, 'uuid');

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
