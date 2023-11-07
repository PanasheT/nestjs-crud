import { PickType } from '@nestjs/swagger';
import { ProfileEntity } from '../entities';

export class ProfileDto extends PickType(ProfileEntity, [
  'uuid',
  'bio',
  'imageURL',
  'location',
] as const) {}

export function ProfileDtoFactory(model: ProfileEntity[]): ProfileDto[];
export function ProfileDtoFactory(model: ProfileEntity): ProfileDto;
export function ProfileDtoFactory(
  model: ProfileEntity | ProfileEntity[]
): ProfileDto | ProfileDto[] {
  if (Array.isArray(model)) {
    return model.map(ProfileDtoFactory).filter(Boolean);
  }

  if (!(model instanceof ProfileEntity) || model.deleted) return;

  return {
    uuid: model.uuid,
    bio: model.bio,
    imageURL: model.imageURL,
    location: model.location,
  };
}
