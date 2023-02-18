import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthFactory {
  constructor(private readonly jwtService: JwtService) {}
}
