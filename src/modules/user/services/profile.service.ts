import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from '../dtos';
import { ProfileEntity } from '../entities';
import { ProfileFactory } from '../factories/profile.factory';

@Injectable()
export class ProfileService {
  private logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repo: Repository<ProfileEntity>,
    private readonly factory: ProfileFactory
  ) {}

  public async findOne(uuid: string): Promise<ProfileEntity> {
    return await this.repo.findOneBy({ uuid, deleted: false });
  }

  public async findOneOrFail(uuid: string): Promise<ProfileEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted: false });
    } catch {
      throw new NotFoundException('Profile not found');
    }
  }

  public async findAll(): Promise<ProfileEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async updateProfile(
    uuid: string,
    model: UpdateProfileDto
  ): Promise<ProfileEntity> {
    const profile: ProfileEntity = await this.findOneOrFail(uuid);

    return await this.handleProfileUpdate(
      this.getProfileUpdateFromFactory(model, profile)
    );
  }

  private getProfileUpdateFromFactory(
    model: UpdateProfileDto,
    profile: ProfileEntity
  ): ProfileEntity {
    try {
      return this.factory.updateProfile(model, profile);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  private async handleProfileUpdate(
    model: ProfileEntity
  ): Promise<ProfileEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
