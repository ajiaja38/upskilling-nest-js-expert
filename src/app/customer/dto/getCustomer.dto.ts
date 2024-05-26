import { CustomerStatus } from 'src/utils/enum/customerStatus.enum';

export interface IGetCustomer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phoneNumber: string;
  email: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
}
