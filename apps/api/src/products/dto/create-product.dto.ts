import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
