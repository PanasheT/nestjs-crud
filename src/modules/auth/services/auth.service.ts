import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { validateHash } from 'src/util';
import {
  UserLoginDto,
  UserLoginResultDto,
  UserUpdatePasswordDto,
} from '../dtos';
import { AuthFactory } from '../factories';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly factory: AuthFactory
  ) {}

  public async loginUser({
    username,
    password,
  }: UserLoginDto): Promise<UserLoginResultDto> {
    const user: UserEntity = await this.userService.findOneUserOrFail(
      username,
      'username'
    );

    await this.comparePasswords(password, user.password);

    return await this.factory.generateToken(user);
  }

  private async comparePasswords(
    password: string,
    hash: string
  ): Promise<void> {
    const isPassword: boolean = await validateHash(password, hash);

    if (!isPassword) {
      throw new UnauthorizedException();
    }
  }

  public async updateUserPassword({
    oldPassword,
    newPassword,
    userUUID,
  }: UserUpdatePasswordDto): Promise<void> {
    const user: UserEntity = await this.userService.findOneUserOrFail(
      userUUID,
      'uuid'
    );

    await this.comparePasswords(oldPassword, user.password);
    await this.userService.updateUserPassword(userUUID, newPassword);
  }
}
