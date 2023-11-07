import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto, UpdatePostDto } from 'src/modules/Post/dtos';
import { PostDto, PostDtoFactory } from 'src/modules/Post/dtos/Post.dto';
import { PostEntity } from '../entities';
import { PostService } from '../services';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Post successfully created.',
    type: PostDto,
  })
  public async createNewPost(@Body() model: CreatePostDto): Promise<PostDto> {
    const post: PostEntity = await this.service.createPost(model);
    return PostDtoFactory(post);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all posts.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Posts successfully retrieved.',
    type: [PostDto],
  })
  public async findAllPosts(): Promise<PostDto[]> {
    const posts: PostEntity[] = await this.service.findAllPosts();
    return posts.map(PostDtoFactory).filter(Boolean);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific post by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Post successfully retrieved.',
    type: PostDto,
  })
  public async findOnePost(@Param('uuid') uuid: string): Promise<PostDto> {
    const post: PostEntity = await this.service.findOnePostOrFail(uuid);
    return PostDtoFactory(post);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific post by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Post successfully updated.',
    type: PostDto,
  })
  public async updatePost(
    @Param('uuid') uuid: string,
    @Body() model: UpdatePostDto
  ): Promise<PostDto> {
    const updatedPost: PostEntity = await this.service.updatePost(uuid, model);
    return PostDtoFactory(updatedPost);
  }

  @Delete(':uuid/:userUUID')
  @ApiOperation({ summary: 'Delete a specific post by uuid.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Post successfully deleted.',
  })
  public async deletePost(
    @Param('uuid') uuid: string,
    @Param('userUUID') userUUID: string
  ): Promise<void> {
    await this.service.deletePost(uuid, userUUID);
  }
}
