import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateCategoryInput, UpdateCategoryInput, UserRole } from "@fluxos/contracts";

@ApiTags("Categorias de Peças")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.categoriesService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryInput) {
    return this.categoriesService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCategoryInput) {
    return this.categoriesService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
