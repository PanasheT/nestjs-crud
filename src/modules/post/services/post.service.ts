import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly repo: Repository<PostEntity>,    
    ) {}
}
