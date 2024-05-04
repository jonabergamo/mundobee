import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  configurationId?: string;
}
