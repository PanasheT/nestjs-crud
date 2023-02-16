import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileDto, ProfileDtoFactory, UpdateProfileDto } from '../dtos';
import { ProfileEntity } from '../entities';
import { ProfileService } from '../services';

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all profiles.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Users successfully retrieved.',
    type: [ProfileDto],
  })
  public async findAllUsers(): Promise<ProfileDto[]> {
    const profiles: ProfileEntity[] = await this.service.findAllProfiles();
    return profiles.map(ProfileDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific profile by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Profile successfully retrieved.',
    type: ProfileDto,
  })
  public async findOneUser(@Param('uuid') uuid: string): Promise<ProfileDto> {
    const profile: ProfileEntity = await this.service.findOneProfileOrFail(
      uuid
    );
    return ProfileDtoFactory(profile);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific profile by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Profile successfully updated.',
    type: ProfileDto,
  })
  public async updateUser(
    @Param('uuid') uuid: string,
    @Body() model: UpdateProfileDto
  ): Promise<ProfileDto> {
    const updatedUser: ProfileEntity = await this.service.updateProfile(
      uuid,
      model
    );
    return ProfileDtoFactory(updatedUser);
  }
}
