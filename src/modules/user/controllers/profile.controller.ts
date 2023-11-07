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
    description: 'Profiles successfully retrieved.',
    type: [ProfileDto],
  })
  public async findAllProfiles(): Promise<ProfileDto[]> {
    const profiles: ProfileEntity[] = await this.service.findAllProfiles();
    return ProfileDtoFactory(profiles);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific profile by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Profile successfully retrieved.',
    type: ProfileDto,
  })
  public async findOneProfile(
    @Param('uuid') uuid: string
  ): Promise<ProfileDto> {
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
  public async updateProfile(
    @Param('uuid') uuid: string,
    @Body() model: UpdateProfileDto
  ): Promise<ProfileDto> {
    const updatedUser: ProfileEntity = await this.service.updateProfile(
      uuid,
      model
    );
    return ProfileDtoFactory(updatedUser);
  }

  @Get('user/:uuid')
  @ApiOperation({ summary: 'Retrieve a specific profile by user uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Profile successfully retrieved.',
    type: ProfileDto,
  })
  public async findOneProfileByUserUUID(
    @Param('uuid') uuid: string
  ): Promise<ProfileDto> {
    const profile: ProfileEntity = await this.service.findOneProfileByUserUUID(
      uuid
    );
    return ProfileDtoFactory(profile);
  }
}
