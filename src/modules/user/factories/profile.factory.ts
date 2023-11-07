import { getDefaultImageUrl, validateUpdate } from 'src/util';
import { CreateProfileDto, UpdateProfileDto } from '../dtos';
import { ProfileEntity } from '../entities';

export class ProfileFactory {
  public createProfile(model: CreateProfileDto, email: string): ProfileEntity {
    model = {
      ...model,
      imageURL: model?.imageURL ? model.imageURL : getDefaultImageUrl(email),
    };

    return Object.assign(new ProfileEntity(), model);
  }

  public updateProfile(
    model: UpdateProfileDto,
    profile: ProfileEntity
  ): ProfileEntity {
    const update: Partial<ProfileEntity> = validateUpdate(profile, model);
    return Object.assign(profile, update);
  }
}
