import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {
    code: number;
    message: string;
  } {
    return {
      code: HttpStatus.OK,
      message: 'Hello Upskilling Nest',
    };
  }
}
