import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserDtoFactory } from 'src/modules/user/dtos/user.dto';
import { UserEntity } from 'src/modules/user/entities';
import { UserLoginResultDto } from '../dtos';

@Injectable()
export class AuthFactory {
  constructor(private readonly jwtService: JwtService) {}

  async generateSuccessfulLoginResult(
    model: UserEntity
  ): Promise<UserLoginResultDto> {
    const user: UserDto = UserDtoFactory(model);
    const token: string = await this.jwtService.signAsync({ ...user });

    return new UserLoginResultDto(token, user);
  }
}
