import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { LoginDto, RegisterDto } from "./dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Efetuar login com e-mail e senha" })
  @ApiResponse({ status: 200, description: "Login realizado com sucesso e token JWT retornado" })
  @ApiResponse({ status: 401, description: "Credenciais inválidas" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cadastrar nova oficina / usuário administrador" })
  @ApiResponse({ status: 201, description: "Oficina e usuário criados com sucesso" })
  @ApiResponse({ status: 409, description: "E-mail já cadastrado" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @Get("me")
  @ApiOperation({ summary: "Obter dados do usuário logado" })
  async me(@CurrentUser() user: any) {
    return user;
  }
}
