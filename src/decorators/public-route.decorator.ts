import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IsPublicRouteKey = 'IsPublicRoute';
export const PublicRoute = (): CustomDecorator<string> =>
  SetMetadata(IsPublicRouteKey, true);
