import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/Pagination.dto';

export class CampaignPledgeQueryDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search? = '';
}
