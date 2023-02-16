import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
