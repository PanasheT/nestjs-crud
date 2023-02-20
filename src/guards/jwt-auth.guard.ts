import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IsPublicRouteKey } from 'src/decorators';
import { UserDto } from 'src/modules/user/dtos/user.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.assertRouteIsPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token: string = authHeader.split(' ')[1];

    return this.decodeToken(token, request);
  }

  private assertRouteIsPublic(context: ExecutionContext): boolean {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IsPublicRouteKey,
      [context.getHandler(), context.getClass()]
    );

    return !!isPublicRoute;
  }

  private async decodeToken(token: string, request: any): Promise<boolean> {
    try {
      request.user = (await this.jwtService.verifyAsync(token)) as UserDto;
      return true;
    } catch (error) {
      return false;
    }
  }
}
