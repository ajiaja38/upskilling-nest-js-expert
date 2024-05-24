import { Injectable } from '@nestjs/common';

@Injectable()
export class TimezoneService {
  getTimeZone(): string {
    const now: Date = new Date();
    now.setHours(now.getHours() + 7);

    return now.toISOString();
  }
}
