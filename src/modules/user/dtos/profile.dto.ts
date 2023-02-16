import { PickType } from '@nestjs/swagger';
import { ProfileEntity } from '../entities';

export class ProfileDto extends PickType(ProfileEntity, [
  'uuid',
  'bio',
  'imageURL',
  'location',
] as const) {}

export function ProfileDtoFactory(model: ProfileEntity): ProfileDto {
  return {
    uuid: model.uuid,
    bio: model.bio,
    imageURL: model.imageURL,
    location: model.location,
  };
}
