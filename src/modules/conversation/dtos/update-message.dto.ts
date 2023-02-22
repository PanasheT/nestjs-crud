import { PickType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PickType(CreateMessageDto, [
  'text',
] as const) {}

export function SanitiseUpdateMessageDto(
  model: UpdateMessageDto
): UpdateMessageDto {
  return Object.assign(new UpdateMessageDto(), {
    ...model,
    text: model.text.trim(),
  });
}
