import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schema/customer.schema';
import { ClientSession, Model } from 'mongoose';
import { UpdateCustomerDto } from './dto/UpdateCustomer.dto';
import { TimezoneService } from '../timezone/timezone.service';
import { MessageService } from '../message/message.service';
import { IGetCustomer } from './dto/getCustomer.dto';
import { CustomerStatus } from 'src/utils/enum/customerStatus.enum';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerSchema: Model<Customer>,
    private timeZoneService: TimezoneService,
    private messageService: MessageService,
  ) {}

  async createCustomer(
    firstName: string,
    lastName: string,
    userId: string,
    session: ClientSession,
  ): Promise<void> {
    const createdAt: string = this.timeZoneService.getTimeZone();
    const updatedAt: string = createdAt;
    await new this.customerSchema({
      firstName,
      lastName,
      userId,
      createdAt,
      updatedAt,
    }).save({ session });
  }

  async getCustomerById(id: string): Promise<IGetCustomer> {
    const customer: IGetCustomer[] = await this.customerSchema.aggregate([
      {
        $match: { id },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          id: 1,
          firstName: 1,
          lastName: 1,
          birthDate: 1,
          phoneNumber: 1,
          status: 1,
          email: '$user.email',
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!customer.length) throw new NotFoundException('Customer Not Found');
    return customer[0];
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const { firstName, lastName, birthDate, phoneNumber } = updateCustomerDto;
    const updatedCustomer: Customer =
      await this.customerSchema.findOneAndUpdate(
        { id },
        {
          firstName,
          lastName,
          birthDate: new Date(birthDate),
          phoneNumber,
          status: CustomerStatus.ACTIVE,
          updatedAt: this.timeZoneService.getTimeZone(),
        },
        { new: true },
      );

    if (!updatedCustomer) throw new NotFoundException('Customer Not Found');

    this.messageService.setMessage('Update Customer Successfully');
    return updatedCustomer;
  }

  async deleteCustomer(userId: string, session: ClientSession): Promise<void> {
    await this.customerSchema.deleteOne({ userId }, { session });
  }
}
