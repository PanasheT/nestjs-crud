import { UserDto } from 'src/modules/user/dtos/user.dto';

export class UserLoginResultDto {
  readonly token: string;
  readonly user: UserDto;

  public constructor(token: string, user: UserDto) {
    if (token && user) {
      this.token = token;
      this.user = user;
      return;
    }

    throw new Error('Failed to create login result.');
  }
}
