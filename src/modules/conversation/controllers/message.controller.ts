import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateMessageDto,
  MessageDto,
  MessageDtoFactory,
  SanitiseUpdateMessageDto,
  UpdateMessageDto,
} from '../dtos';
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
  public async createNewMessage(
    @Body() model: CreateMessageDto
  ): Promise<MessageDto> {
    const message: MessageEntity = await this.service.createMessage(model);

    return MessageDtoFactory(message);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a specific message by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Message successfully updated.',
    type: MessageDto,
  })
  public async updateMessage(
    @Param('uuid') uuid: string,
    @Body() model: UpdateMessageDto
  ): Promise<MessageDto> {
    const updatedMessage: MessageEntity = await this.service.updateMessage(
      uuid,
      SanitiseUpdateMessageDto(model)
    );

    return MessageDtoFactory(updatedMessage);
  }
}
