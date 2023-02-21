import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  readonly sourceUUID: string;

  @IsUUID()
  @IsNotEmpty()
  readonly conversationUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;
}
