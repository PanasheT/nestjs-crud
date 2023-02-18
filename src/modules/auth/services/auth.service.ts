import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { AuthFactory } from '../factories';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly factory: AuthFactory
  ) {}
}
