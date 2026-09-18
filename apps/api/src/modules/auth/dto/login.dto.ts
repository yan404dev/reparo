import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@fluxos.com", description: "E-mail profissional cadastrado" })
  @IsEmail({}, { message: "Informe um e-mail válido" })
  @IsNotEmpty({ message: "O e-mail é obrigatório" })
  email: string;

  @ApiProperty({ example: "admin123", minLength: 6, description: "Senha da conta" })
  @IsString({ message: "A senha deve ser um texto" })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string;
}
