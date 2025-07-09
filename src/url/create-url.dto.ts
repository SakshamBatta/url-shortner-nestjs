import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  customCode?: string;
}
