import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/utils/enum/role.enum';

export const Roles = (...roles: ERole[]) => SetMetadata('roles', roles);
