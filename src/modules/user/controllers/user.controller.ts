import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserDto, UserDtoFactory } from '../dtos/user.dto';
import { UserService } from '../services';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  public async createNewUser(@Body() model: CreateUserDto): Promise<UserDto> {
    const user = await this.service.createUser(model);
    return UserDtoFactory(user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Users successfully retrieved.',
    type: [UserDto],
  })
  public async findAllUsers(): Promise<UserDto[]> {
    const users = await this.service.findAllUsers();
    return users.map(UserDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific user by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'User successfully retrieved.',
    type: UserDto,
  })
  public async findOneUser(@Param('uuid') uuid: string): Promise<UserDto> {
    const user = await this.service.findOneUserOrFail(uuid, 'uuid');
    return UserDtoFactory(user);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific user by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User successfully updated.',
    type: UserDto,
  })
  public async updateUser(
    @Param('uuid') uuid: string,
    @Body() model: UpdateUserDto
  ): Promise<UserDto> {
    const updatedUser = await this.service.updateUser(uuid, model);
    return UserDtoFactory(updatedUser);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific user by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'User successfully deleted.',
  })
  public async deleteUser(@Param('uuid') uuid: string): Promise<void> {
    await this.service.deleteUser(uuid);
  }

  @Put('/deactivate/:uuid')
  @ApiOperation({ summary: 'Deactivate a specific user by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'User successfully deactivated.',
  })
  public async deactivateUser(@Param('uuid') uuid: string): Promise<void> {
    await this.service.deactivateUser(uuid);
  }

  @Put('/reactivate/:uuid')
  @ApiOperation({ summary: 'Reactivate a specific user by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'User successfully reactivated.',
  })
  public async reactivateUser(@Param('uuid') uuid: string): Promise<void> {
    await this.service.reactivateUser(uuid);
  }
}
