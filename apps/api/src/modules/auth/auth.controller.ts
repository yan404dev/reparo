import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { LoginInput } from "@fluxos/contracts";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginInput) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get("me")
  async me(@CurrentUser() user: any) {
    return user;
  }
}
