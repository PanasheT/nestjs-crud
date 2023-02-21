import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto, MessageDto, MessageDtoFactory } from '../dtos';
import { MessageEntity } from '../entities';
import { MessageService } from '../services';

@Controller('messages')
@ApiTags('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The message has been successfully created.',
    type: MessageDto,
  })
  public async createNewUser(
    @Body() model: CreateMessageDto
  ): Promise<MessageDto> {
    const message: MessageEntity = await this.service.createMessage(model);

    return MessageDtoFactory(message);
  }
}
