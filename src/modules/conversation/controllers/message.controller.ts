import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
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

  @Get()
  @ApiOperation({ summary: 'Retrieve all messages.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Messages successfully retrieved.',
    type: [MessageDto],
  })
  public async findAllMessages(): Promise<MessageDto[]> {
    const messages: MessageEntity[] = await this.service.findAllMessages();
    return messages.map(MessageDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific message by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Message successfully retrieved.',
    type: MessageDto,
  })
  public async findOneMessage(
    @Param('uuid') uuid: string
  ): Promise<MessageDto> {
    const message: MessageEntity = await this.service.findOneMessageOrFail(
      uuid
    );
    return MessageDtoFactory(message);
  }

  @Get('conversation/:conversationUUID')
  @ApiOperation({ summary: 'Retrieve all messages by conversation uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Messages successfully retrieved.',
    type: MessageDto,
  })
  public async findAllMessagesInConversation(
    @Param('conversationUUID') conversationUUID: string
  ): Promise<MessageDto[]> {
    const messages: MessageEntity[] =
      await this.service.findAllMessagesInConversation(conversationUUID);
    return messages.map(MessageDtoFactory);
  }

  @Get('range/:senderUUID')
  @ApiOperation({
    summary:
      'Retrieve all messages within a specified date range by sender uuid.',
  })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Messages successfully retrieved.',
    type: MessageDto,
  })
  public async findMessagesWithinDateRange(
    @Param('senderUUID') senderUUID: string,
    @Query('startDate') startDate: Date
  ): Promise<[MessageDto[], number]> {
    const [messages, messageCount] =
      await this.service.findMessagesWithinDateRange(senderUUID, startDate);

    return [messages.map(MessageDtoFactory), messageCount];
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

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific message by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Message successfully deleted.',
  })
  public async permanentlyDeleteMessage(
    @Param('uuid') uuid: string
  ): Promise<void> {
    await this.service.permanentlyDeleteMessage(uuid);
  }
}
