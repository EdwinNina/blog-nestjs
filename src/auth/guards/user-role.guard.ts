import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_DATA_ROLES } from '../decorators/role.decorator';
import { ActiveRoles } from '../interfaces/active-roles.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const roles: ActiveRoles[] = this.reflector.get<ActiveRoles[]>(META_DATA_ROLES, context.getHandler())

    if(!roles) return true

    const request = context.switchToHttp().getRequest()

    const user: User = request.user;

    if(!user) throw new NotFoundException("User not found in request");

    for (const role of roles) {
      if(role === user.role.name) return true
    }

    throw new UnauthorizedException(`User ${user.username} does not have to an access role`);
  }
}
