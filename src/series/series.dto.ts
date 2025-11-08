import { SerieImageDto } from 'src/serie_images/serie_images.dto';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSerieDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  nickname: string | null;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description: string | null;

  @IsOptional()
  @IsString()
  image: string | null;
}

export class SerieDto {
  id: number;
  name: string;
  nickname: string | null;
  description: string | null;
  imageId: number | null;
  createdAt: Date;
  updatedAt: Date;
  image: SerieImageDto | null;
}
