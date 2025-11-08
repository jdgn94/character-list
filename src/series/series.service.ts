import { Injectable } from '@nestjs/common';
import { CreateSerieDto } from './series.dto';

@Injectable()
export class SeriesService {
  getAll() {}

  getPaginate(name = '', nickname = '', page = 0, limit = 20) {
    console.log('all parameters', page, name, nickname, limit);
  }

  create(serie: CreateSerieDto) {
    console.log(serie);
  }
}
