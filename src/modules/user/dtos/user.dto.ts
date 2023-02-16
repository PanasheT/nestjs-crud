import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities';

export class UserDto extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'username',
  'email',
] as const) {}

export function UserDtoFactory(model: UserEntity): UserDto {
  return {
    firstName: model.firstName,
    lastName: model.lastName,
    username: model.username,
    email: model.email,
  };
}
