import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { Constants } from 'src/common';

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @Matches(Constants.PasswordRegEx)
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;

  @IsUUID()
  @IsNotEmpty()
  readonly userUUID: string;
}
