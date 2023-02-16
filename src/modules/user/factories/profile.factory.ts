import { CreateProfileDto } from '../dtos';
import { ProfileEntity } from '../entities';

export class ProfileFactory {
  public createProfile(model: CreateProfileDto): ProfileEntity {
    return Object.assign(new ProfileEntity(), model);
  }
}
