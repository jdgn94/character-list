/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

interface PaginateSearchParams {
  page: string;
  limit: string;
  name: string;
  nickname: string;
}

@Injectable()
export class PaginateSearchPipe implements PipeTransform {
  transform(value: PaginateSearchParams, metadata: ArgumentMetadata) {
    const page = parseInt(value.page, 10) || 0;
    const limit = parseInt(value.limit, 10) || 20;
    const name = value.name ? String(value.name) : '';
    const nickname = value.nickname ? String(value.nickname) : '';

    return { page, limit, name, nickname };
  }
}
