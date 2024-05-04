import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  fullName: string; // Nome completo do usuário

  @IsNotEmpty()
  @IsEmail()
  email: string; // E-mail do usuário

  @IsNotEmpty()
  @IsString()
  password: string; // Senha do usuário
}
