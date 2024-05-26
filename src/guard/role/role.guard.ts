import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ERole } from 'src/utils/enum/role.enum';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: ERole[] = this.reflector.get<ERole[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: IJwtPayload = request.user;

    if (!this.matchRoles(roles, user.roles)) {
      throw new Error('You do not have permission to access this resource');
    }

    return this.matchRoles(roles, user.roles);
  }

  private matchRoles(allowedRoles: ERole[], userRole: ERole[]) {
    return allowedRoles.some((role) => userRole.includes(role));
  }
}
