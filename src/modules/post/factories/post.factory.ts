import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../entities';

@Injectable()
export class PostFactory {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repo: Repository<PostEntity>,
    private readonly userService: UserService
  ) {}

  public async createPost(model: CreatePostDto): Promise<PostEntity> {
    const { userUUID, ...dto } = model;

    const user: UserEntity = await this.userService.findOneUserOrFail(
      userUUID,
      'uuid'
    );

    return Object.assign(new PostEntity(), { user, ...dto });
  }

  public updatePost(model: UpdatePostDto, post: PostEntity): PostEntity {
    return Object.assign(post, model);
  }
}
