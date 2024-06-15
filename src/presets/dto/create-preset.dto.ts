import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePresetDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  internal_humidity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  internal_temperature: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  external_humidity: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  external_temperature: number;
}


