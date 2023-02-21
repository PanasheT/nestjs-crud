import { PickType } from '@nestjs/swagger';
import { UserDto, UserDtoFactory } from 'src/modules/user/dtos/user.dto';
import { MessageEntity } from '../entities';
import { ConversationDto, ConversationDtoFactory } from './conversation.dto';

export class MessageDto extends PickType(MessageEntity, [
  'createdAt',
  'text',
  'uuid',
] as const) {
  sender: UserDto;
  conversation: ConversationDto;
}

export function MessageDtoFactory(model: MessageEntity): MessageDto {
  return {
    createdAt: model.createdAt,
    text: model.text,
    uuid: model.uuid,
    sender: UserDtoFactory(model.sender),
    conversation: ConversationDtoFactory(model.conversation),
  };
}
