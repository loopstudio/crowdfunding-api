import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ALLOW_UNAUTHENTICATE_REQUEST = 'allowUnauthenticatedRequest';

// Use it when you want to access to an endpoint without auth user data
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Use it when you want to handle both cases, without token and with token and user data
export const AllowUnauthenticatedRequest = () =>
  SetMetadata(IS_ALLOW_UNAUTHENTICATE_REQUEST, true);
