import { ERole } from 'src/utils/enum/role.enum';

export interface IGetUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetUserDetail {
  id: string;
  email: string;
  roles: ERole[];
  createdAt: Date;
  updatedAt: Date;
}
