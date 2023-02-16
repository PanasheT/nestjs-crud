import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../services';

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}
}
