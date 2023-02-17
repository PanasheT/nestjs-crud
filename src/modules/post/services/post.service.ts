import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/services';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos';
import { PostEntity } from '../entities';
import { PostFactory } from '../factories';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repo: Repository<PostEntity>,
    private readonly factory: PostFactory,
    private readonly userService: UserService
  ) {}

  public async findOnePost(uuid: string): Promise<PostEntity> {
    return await this.repo.findOneBy({ uuid, deleted: false });
  }

  public async findOnePostOrFail(uuid: string): Promise<PostEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted: false });
    } catch {
      throw new NotFoundException('Post not found');
    }
  }

  public async findAllPosts(): Promise<PostEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async findAllUsersPosts(userUUID: string): Promise<PostEntity[]> {
    await this.userService.findOneUserOrFail(userUUID, 'uuid');

    return await this.repo.findBy({ user: { uuid: userUUID }, deleted: false });
  }

  public async createPost(model: CreatePostDto): Promise<PostEntity> {
    return await this.handlePostSave(await this.getPostFromFactory(model));
  }

  private async getPostFromFactory(model: CreatePostDto): Promise<PostEntity> {
    try {
      return await this.factory.createPost(model);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  private async handlePostSave(model: PostEntity): Promise<PostEntity> {
    try {
      return await this.repo.save(model);
    } catch {
      throw new InternalServerErrorException('Failed to create post');
    }
  }
}
