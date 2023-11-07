import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IsPublicRouteKey } from 'src/decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  private readonly logger: Logger;

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (this.isRoutePublic(context)) return true;

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization as string;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header.');
      }

      const token = authHeader.split(' ')[1];

      request.user = await this.jwtService.verifyAsync(token);

      return true;
    } catch (err) {
      this.logger.error(err?.message ?? err);

      throw new UnauthorizedException();
    }
  }

  private isRoutePublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IsPublicRouteKey, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
