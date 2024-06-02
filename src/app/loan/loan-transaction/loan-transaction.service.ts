import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoanTransaction } from './schema/loanTransaction.schema';
import { ClientSession, Model } from 'mongoose';
import { TimezoneService } from 'src/app/timezone/timezone.service';
import { CreateLoanReqDto } from './dto/createLoanReq.dto';
import { ILoanTrx } from './dto/responseLoan.dto';
import { CustomerService } from 'src/app/customer/customer.service';
import { LoanTypeService } from '../loan-type/loan-type.service';
import { InstalmentTypeService } from '../instalment-type/instalment-type.service';
import { LoanType } from '../loan-type/schema/LoanType.schema';
import { InstalmentType } from '../instalment-type/schema/instalmentType.schema';
import { IGetCustomer } from 'src/app/customer/dto/getCustomer.dto';
import { ApproveRejectDto } from './dto/approveReject.dto';
import { ILoanTrxGetAggregate } from './dto/loanTrxGetAggregate.dto';

@Injectable()
export class LoanTransactionService {
  constructor(
    @InjectModel(LoanTransaction.name)
    private loanTransactionSchema: Model<LoanTransaction>,

    private customerService: CustomerService,
    private loanTypeService: LoanTypeService,
    private instalmentTypeService: InstalmentTypeService,
    private timeZoneService: TimezoneService,
  ) {}

  async createLoanTransaction(
    userId: string,
    createLoanReqDto: CreateLoanReqDto,
  ): Promise<ILoanTrx> {
    const createdAt: string = this.timeZoneService.getTimeZone();
    const updatedAt: string = createdAt;
    const { loanTypeId, instalmentTypeId, nominal, description } =
      createLoanReqDto;

    const session: ClientSession =
      await this.loanTransactionSchema.db.startSession();
    session.startTransaction();

    try {
      const { customer, loanType, instalmentType } = await this.queryLoanTrx(
        userId,
        loanTypeId,
        instalmentTypeId,
        session,
      );

      if (nominal > loanType.maxLoan)
        throw new BadRequestException('Too Much Loan');

      const createLoanTrx: LoanTransaction =
        await this.loanTransactionSchema.create({
          customerId: customer.id,
          loanTypeId,
          instalmentTypeId,
          nominal,
          description,
          createdAt,
          updatedAt,
        });

      if (!createLoanTrx) throw new BadRequestException('Create Loan Failed');

      await session.commitTransaction();

      return this.transformResponseLoanTrx(
        createLoanTrx,
        customer,
        loanType,
        instalmentType,
      );
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message);
    } finally {
      session.endSession();
    }
  }

  async getLoanTrxAggregate(
    id?: string,
    customerId?: string,
  ): Promise<ILoanTrxGetAggregate> {
    const loanTrx: ILoanTrxGetAggregate[] =
      await this.loanTransactionSchema.aggregate([
        {
          $match: {
            id: id ? id : { $ne: null },
            customerId: customerId ? customerId : { $ne: null },
          },
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: 'id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $project: {
            _id: 0,
            id: 1,
            loanTypeId: 1,
            instalmentTypeId: 1,
            customerUserId: '$customer.userId',
            nominal: 1,
            approvedBy: 1,
            approvalStatus: 1,
            loanStatus: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

    if (!loanTrx) throw new NotFoundException('Loan Transaction Not Found');

    return loanTrx[0];
  }

  async actionLoanTrxByAdmin(
    adminEmail: string,
    trxId: string,
    approveRejectDto: ApproveRejectDto,
  ): Promise<ILoanTrx> {
    const session: ClientSession =
      await this.loanTransactionSchema.db.startSession();
    session.startTransaction();

    try {
      const { id, customerUserId, loanTypeId, instalmentTypeId } =
        await this.getLoanTrxAggregate(trxId);

      const { approvalStatus } = approveRejectDto;
      const updatedAt = this.timeZoneService.getTimeZone();

      const updatedLoanTrx: LoanTransaction =
        await this.loanTransactionSchema.findOneAndUpdate(
          { id },
          { approvalStatus, approvedBy: adminEmail, updatedAt },
          { new: true },
        );

      if (!updatedLoanTrx)
        throw new BadRequestException('Update Loan Transaction Failed');

      const { customer, loanType, instalmentType } = await this.queryLoanTrx(
        customerUserId,
        loanTypeId,
        instalmentTypeId,
        session,
      );

      await session.commitTransaction();

      return this.transformResponseLoanTrx(
        updatedLoanTrx,
        customer,
        loanType,
        instalmentType,
      );
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message);
    } finally {
      session.endSession();
    }
  }

  async queryLoanTrx(
    userId: string,
    loanTypeId: string,
    instalmentTypeId: string,
    session: ClientSession,
  ): Promise<{
    customer: IGetCustomer;
    loanType: LoanType;
    instalmentType: InstalmentType;
  }> {
    const customer: IGetCustomer = await this.customerService.getCustomerById(
      userId,
      session,
    );

    const loanType: LoanType = await this.loanTypeService.getLoanTypeById(
      loanTypeId,
      session,
    );

    const instalmentType: InstalmentType =
      await this.instalmentTypeService.getInstalmentTypeById(
        instalmentTypeId,
        session,
      );

    return { customer, loanType, instalmentType };
  }

  transformResponseLoanTrx(
    loanTransaction: LoanTransaction,
    customer: IGetCustomer,
    loanType: LoanType,
    instalmentType: InstalmentType,
  ): ILoanTrx {
    const {
      id,
      nominal,
      approvedBy,
      approvalStatus,
      loanStatus,
      description,
      createdAt,
      updatedAt,
    } = loanTransaction;

    return {
      id,
      loanType: loanType.loanType,
      instalmentType: instalmentType.instalmentType,
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
      },
      nominal,
      approvedBy,
      approvalStatus,
      loanStatus,
      description,
      createdAt,
      updatedAt,
    };
  }
}
