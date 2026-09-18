import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "Carlos Silva", description: "Nome do responsável ou usuário" })
  @IsString({ message: "O nome deve ser um texto" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name: string;

  @ApiProperty({ example: "contato@suaoficina.com", description: "E-mail profissional" })
  @IsEmail({}, { message: "Informe um e-mail válido" })
  email: string;

  @ApiProperty({ example: "123456", minLength: 6, description: "Senha com no mínimo 6 caracteres" })
  @IsString({ message: "A senha deve ser um texto" })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string;

  @ApiPropertyOptional({ example: "FixTech Oficina", description: "Nome da oficina / loja" })
  @IsOptional()
  @IsString({ message: "O nome da oficina deve ser um texto" })
  storeName?: string;

  @ApiPropertyOptional({ example: "FixTech Oficina", description: "Alias do nome da oficina" })
  @IsOptional()
  @IsString({ message: "O nome da oficina deve ser um texto" })
  shopName?: string;

  @ApiPropertyOptional({ example: "11999999999", description: "WhatsApp comercial" })
  @IsOptional()
  @IsString({ message: "O telefone deve ser um texto" })
  phone?: string;
}
