import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  readonly senderUUID: string;

  @IsUUID()
  @IsNotEmpty()
  readonly recipientUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly messageText: string;
}
