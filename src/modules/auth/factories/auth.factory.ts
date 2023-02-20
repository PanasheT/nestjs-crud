import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserDtoFactory } from 'src/modules/user/dtos/user.dto';
import { UserEntity } from 'src/modules/user/entities';
import { UserLoginResultDto } from '../dtos';

@Injectable()
export class AuthFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async generateToken(model: UserEntity): Promise<UserLoginResultDto> {
    const user: UserDto = UserDtoFactory(model);

    const token: string = await this.jwtService.signAsync(
      { ...user },
      {
        secret: this.config.get<string>('TOKEN_SECRET'),
        expiresIn: this.config.get<number>('TOKEN_DURATION'),
      }
    );

    return Object.assign(new UserLoginResultDto(), { user, token });
  }
}
