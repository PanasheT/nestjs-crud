import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  @IsUUID()
  @IsNotEmpty()
  readonly userUUID: string;
}
