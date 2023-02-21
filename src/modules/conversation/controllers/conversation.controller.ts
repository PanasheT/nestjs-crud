import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationService } from '../services';

@Controller('conversations')
@ApiTags('conversations')
export class ConversationController {
    constructor(private readonly service: ConversationService) {}
}
