import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly caption: string;

  @IsString()
  @IsOptional()
  readonly imageUrl: string;

  @IsString()
  @IsOptional()
  readonly location: string;
}
