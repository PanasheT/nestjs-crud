import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  readonly senderUUID: string;

  @IsUUID()
  @IsNotEmpty()
  readonly recipientUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;
}
