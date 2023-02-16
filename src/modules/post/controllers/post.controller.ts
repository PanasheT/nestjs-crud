import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostService } from '../services';

@Controller('posts')
@ApiTags('posts')
export class PostController {
    constructor(private readonly service: PostService) {}
}
