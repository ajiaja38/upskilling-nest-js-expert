import { ERole } from '../enum/role.enum';

export interface IJwtPayload {
  id: string;
  email: string;
  roles: ERole[];
}
