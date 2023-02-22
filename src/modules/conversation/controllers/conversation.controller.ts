import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConversationDto,
  ConversationDtoFactory,
  CreateConversationDto,
} from '../dtos';
import { ConversationEntity } from '../entities';
import { ConversationService } from '../services';

@Controller('conversations')
@ApiTags('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The conversation has been successfully created.',
    type: ConversationDto,
  })
  public async createNewConversation(
    @Body() model: CreateConversationDto
  ): Promise<ConversationDto> {
    const conversation: ConversationEntity =
      await this.service.createConversation(model);

    return ConversationDtoFactory(conversation);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all conversations.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Conversations successfully retrieved.',
    type: [ConversationDto],
  })
  public async findAllConversations(): Promise<ConversationDto[]> {
    const conversations: ConversationEntity[] =
      await this.service.findAllConversations();

    return conversations.map(ConversationDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific conversation by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Conversation successfully retrieved.',
    type: ConversationDto,
  })
  public async findOneConversation(
    @Param('uuid') uuid: string
  ): Promise<ConversationDto> {
    const conversation: ConversationEntity =
      await this.service.findOneConversationOrFail(uuid);

    return ConversationDtoFactory(conversation);
  }
}
