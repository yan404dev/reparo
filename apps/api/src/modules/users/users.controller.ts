import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { Roles } from "../../common/decorators/roles.decorator";
import { RolesGuard } from "../../common/guards/roles.guard";
import { RegisterUserInput, UserRole } from "@fluxos/contracts";

@ApiTags("Usuários")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: RegisterUserInput) {
    return this.usersService.create(dto);
  }
}
