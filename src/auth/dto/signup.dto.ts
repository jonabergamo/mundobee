import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: "Testing Name", description: "The full name of the new user" })
  fullName: string; // Nome completo do usuário

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: "test@gmail.com", description: "The email of the new user" })
  email: string; // E-mail do usuário

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: "password@123", description: "A strong password for the new user" })
  password: string; // Senha do usuário
}

