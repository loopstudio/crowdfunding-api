import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { PaginationDto } from 'src/common/dto/Pagination.dto';

export class CampaignQueryDto extends PaginationDto {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  own? = false;

  @IsString()
  @IsOptional()
  search? = '';
}
