import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly service: UserService) {}
}
