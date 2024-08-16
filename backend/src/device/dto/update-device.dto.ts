import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isOn?: boolean;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  inCount?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  outCount?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  configurationId?: string;
}

