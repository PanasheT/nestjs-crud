import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { validateHash } from 'src/util';
import { UserLoginDto, UserLoginResultDto } from '../dtos';
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

    const isPassword: boolean = await validateHash(password, user.password);

    if (!isPassword) {
      throw new UnauthorizedException();
    }

    return await this.factory.generateToken(user);
  }
}
