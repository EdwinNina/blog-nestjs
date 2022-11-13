import { SetMetadata } from '@nestjs/common';

export const META_DATA_ROLES = 'roles';

export const Role = (...roles: string[]) => SetMetadata(META_DATA_ROLES, roles);
