import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePresetDto {

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    name?: string;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    internal_humidity?: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    internal_temperature?: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    external_humidity?: number;
  
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    external_temperature?: number;
  }