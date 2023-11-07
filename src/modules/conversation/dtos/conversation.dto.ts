import { PickType } from '@nestjs/swagger';
import { UserDto, UserDtoFactory } from 'src/modules/user/dtos/user.dto';
import { ConversationEntity } from '../entities';

export class ConversationDto extends PickType(ConversationEntity, [
  'uuid',
  'lastMessage',
  'receiptStatus',
  'createdAt',
] as const) {
  sender: UserDto;
  recipient: UserDto;
}

export function ConversationDtoFactory(
  model: ConversationEntity[]
): ConversationDto[];
export function ConversationDtoFactory(
  model: ConversationEntity
): ConversationDto;
export function ConversationDtoFactory(
  model: ConversationEntity | ConversationEntity[]
): ConversationDto | ConversationDto[] {
  if (Array.isArray(model)) {
    return model.map(ConversationDtoFactory).filter(Boolean);
  }

  if (!(model instanceof ConversationEntity) || model.deleted) return;

  return {
    uuid: model.uuid,
    lastMessage: model.lastMessage,
    receiptStatus: model.receiptStatus,
    createdAt: model.createdAt,
    sender: UserDtoFactory(model.sender),
    recipient: UserDtoFactory(model.recipient),
  };
}
