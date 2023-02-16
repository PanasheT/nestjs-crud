import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  readonly bio: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsUrl()
  @IsOptional()
  readonly imageURL: string;
}
