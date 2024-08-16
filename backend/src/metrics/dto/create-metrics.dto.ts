import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMetricsDto {
  @IsNumber()
  inCount: number;

  @IsNumber()
  outCount: number;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsDate()
  timestamp: Date;

  @IsNumber()
  deviceId: string;
}

