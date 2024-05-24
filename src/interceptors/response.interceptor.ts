import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MessageService } from 'src/app/message/message.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly messageService: MessageService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = {
          code: context.switchToHttp().getResponse().statusCode,
          status: true,
          message:
            this.messageService.getMessage() || 'Berhasil Memuat Permintaan',
        };

        if (data) {
          if (Array.isArray(data)) {
            response['data'] = data;
          } else if (data.totalPages || data.page || data.totalData) {
            response['totalPages'] = data.totalPages;
            response['page'] = data.page;
            response['totalData'] = data.totalData;
            response['data'] = data.data;
          } else {
            response['data'] = data;
          }
        }

        return response;
      }),
    );
  }
}
