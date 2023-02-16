import { BadRequestException } from '@nestjs/common';
import { UtilityService as util } from 'src/util';
import { CreateProfileDto, UpdateProfileDto } from '../dtos';
import { ProfileEntity } from '../entities';

export class ProfileFactory {
  public createProfile(model: CreateProfileDto): ProfileEntity {
    return Object.assign(new ProfileEntity(), model);
  }

  public updateProfile(
    model: UpdateProfileDto,
    profile: ProfileEntity
  ): ProfileEntity {
    const update: Partial<ProfileEntity> = util.validateUpdate(profile, model);

    if (Object.entries(update).length === 0) {
      throw new BadRequestException('Update has no changes.');
    }

    Object.assign(profile, update);
    return profile;
  }
}
