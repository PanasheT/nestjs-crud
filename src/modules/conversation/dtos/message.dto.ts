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

export function MessageDtoFactory(model: MessageEntity[]): MessageDto[];
export function MessageDtoFactory(model: MessageEntity): MessageDto;
export function MessageDtoFactory(
  model: MessageEntity | MessageEntity[]
): MessageDto | MessageDto[] {
  if (Array.isArray(model)) {
    return model.map(MessageDtoFactory).filter(Boolean);
  }

  if (!(model instanceof MessageEntity) || model.deleted) return;

  return {
    createdAt: model.createdAt,
    text: model.text,
    uuid: model.uuid,
    sender: model?.sender ? UserDtoFactory(model.sender) : null,
    conversation: model?.conversation
      ? ConversationDtoFactory(model.conversation)
      : null,
  };
}
