import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services';

@Controller('auths')
@ApiTags('auths')
export class AuthController {
    constructor(private readonly service: AuthService) {}
}
