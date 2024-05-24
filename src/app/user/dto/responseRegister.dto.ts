import { ERole } from 'src/utils/enum/role.enum';

export default interface IResponseRegister {
  email: string;
  role: ERole[];
}
