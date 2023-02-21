import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services';

@Controller('messages')
@ApiTags('messages')
export class MessageController {
    constructor(private readonly service: MessageService) {}
}
