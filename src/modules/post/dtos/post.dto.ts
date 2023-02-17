import { PickType } from '@nestjs/swagger';
import { UserDto, UserDtoFactory } from 'src/modules/user/dtos/user.dto';
import { PostEntity } from '../entities';

export class PostDto extends PickType(PostEntity, [
  'caption',
  'imageUrl',
  'location',
  'uuid',
] as const) {
  user: UserDto;
}

export function PostDtoFactory(model: PostEntity): PostDto {
  return {
    caption: model.caption,
    imageUrl: model.imageUrl,
    location: model.location,
    uuid: model.uuid,
    user: UserDtoFactory(model.user),
  };
}
