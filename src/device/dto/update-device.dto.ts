import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isOn?: boolean;

  @IsOptional()
  @IsInt()
  inCount?: number;

  @IsOptional()
  @IsInt()
  outCount?: number;

  @IsOptional()
  @IsString()
  configurationId?: string;
}
