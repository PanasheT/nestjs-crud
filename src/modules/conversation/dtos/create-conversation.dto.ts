import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  readonly sourceUUID: string;

  @IsUUID()
  @IsNotEmpty()
  readonly targetUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly messageText: string;
}
