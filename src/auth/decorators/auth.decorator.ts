import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ActiveRoles } from '../interfaces/active-roles.interface';
import { Role } from './role.decorator';

export function Auth(...roles: ActiveRoles[]) {
   return applyDecorators(
      Role(...roles),
      UseGuards(AuthGuard(), UserRoleGuard),
   );
}