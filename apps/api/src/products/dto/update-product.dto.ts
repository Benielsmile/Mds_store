import { IsString, IsOptional, IsBoolean, IsNumberString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
