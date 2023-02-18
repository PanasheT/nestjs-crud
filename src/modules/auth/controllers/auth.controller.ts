import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto, UserLoginResultDto } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login a user.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login successful.',
    type: UserLoginResultDto,
  })
  public async loginUser(
    @Body() model: UserLoginDto
  ): Promise<UserLoginResultDto> {
    return await this.service.loginUser(model);
  }
}
