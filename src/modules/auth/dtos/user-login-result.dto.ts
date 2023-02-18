import { UserDto } from 'src/modules/user/dtos/user.dto';

export class UserLoginResultDto {
  readonly token: string;
  readonly user: UserDto;
}
