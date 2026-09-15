import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateCompatibilityInput, CreatePartInput, UpdatePartInput, StockEntryInput, StockScrapInput, UserRole } from "@fluxos/contracts";

@ApiTags("Estoque")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller("inventory")
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get("parts")
  async findAll(@Query("categoryId") categoryId?: string, @Query("category") category?: string, @Query("search") search?: string) {
    return this.inventoryService.findAll(categoryId || category, search);
  }

  @Get("parts/compatible")
  async findCompatible(@Query("model") model: string) {
    return this.inventoryService.findCompatible(model || "");
  }

  @Get("parts/:id")
  async findById(@Param("id") id: string) {
    return this.inventoryService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @Post("parts")
  async create(@Body() dto: CreatePartInput) {
    return this.inventoryService.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch("parts/:id")
  async update(@Param("id") id: string, @Body() dto: UpdatePartInput) {
    return this.inventoryService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Post("compatibilities")
  async createCompatibility(@Body() dto: CreateCompatibilityInput) {
    return this.inventoryService.createCompatibility(dto);
  }

  @Roles(UserRole.ADMIN)
  @Post("movements/entry")
  async registerEntry(@Body() dto: StockEntryInput, @CurrentUser("id") userId: string) {
    return this.inventoryService.registerEntry(dto, userId);
  }

  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @Post("movements/scrap")
  async registerScrap(@Body() dto: StockScrapInput, @CurrentUser("id") userId: string) {
    return this.inventoryService.registerScrap(dto, userId);
  }

  @Get("movements")
  async getMovements(@Query("partId") partId?: string) {
    return this.inventoryService.getMovements(partId);
  }
}
