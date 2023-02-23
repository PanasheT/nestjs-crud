import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Constants } from 'src/common';
import { CreateProfileDto } from './create-profile.dto';

export class CreateUserDto extends CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @Matches(Constants.UsernameRegEx)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Matches(Constants.PasswordRegEx)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
