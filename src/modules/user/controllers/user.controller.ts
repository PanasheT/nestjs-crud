import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dtos';
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

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific user by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'User successfully deleted.',
  })
  public async deleteUser(@Param('uuid') uuid: string): Promise<void> {
    await this.service.deleteUser(uuid);
  }
}
