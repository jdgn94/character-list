import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSerieDto } from './series.dto';
import { PaginateSearchPipe } from 'src/service/pipe/url_queries/url_queries.pipe';
import { VerifyUserRolGuard } from 'src/service/guards/user/user.guard';

@Controller('series')
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Get()
  getAll(
    @Query(PaginateSearchPipe)
    query: {
      name: string;
      nickname: string;
      page: number;
      limit: number;
    },
  ) {
    console.log(query);
    return this.seriesService.getPaginate(
      query.name,
      query.nickname,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  get(@Param('id') id: number) {
    console.log('id de la serie: ', id);
  }

  @Post()
  @UseGuards(VerifyUserRolGuard)
  create(@Body() serie: CreateSerieDto) {
    this.seriesService.create(serie);
  }
}
