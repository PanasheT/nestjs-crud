import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities';
import { ProfileDto, ProfileDtoFactory } from './profile.dto';

export class UserDto extends PickType(UserEntity, [
  'firstName',
  'lastName',
  'username',
  'email',
  'uuid',
] as const) {
  profile: ProfileDto;
}

export function UserDtoFactory(model: UserEntity): UserDto {
  if (!(model instanceof UserEntity) || model.deleted) return;

  return {
    firstName: model.firstName,
    lastName: model.lastName,
    username: model.username,
    email: model.email,
    uuid: model.uuid,
    profile: ProfileDtoFactory(model.profile),
  };
}
