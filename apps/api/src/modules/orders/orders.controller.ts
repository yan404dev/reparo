import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { AddOrderItemInput, ApprovePublicOrderInput, CreateServiceOrderInput, PublicCustomerIntakeInput, RejectPublicOrderInput, UpdateOrderStatusInput, UserRole } from "@fluxos/contracts";
import { OrderStatus } from "@prisma/client";

@ApiTags("Ordens de Serviço")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Get("public/:token")
  async findByPublicToken(@Param("token") token: string) {
    return this.ordersService.findByPublicToken(token);
  }

  @Public()
  @Post("public/:token/approve")
  async approveByPublicToken(
    @Param("token") token: string,
    @Body() dto: ApprovePublicOrderInput
  ) {
    return this.ordersService.approveByPublicToken(token, dto?.customerSignature);
  }

  @Public()
  @Post("public/:token/reject")
  async rejectByPublicToken(
    @Param("token") token: string,
    @Body() dto: RejectPublicOrderInput
  ) {
    return this.ordersService.rejectByPublicToken(token, dto?.rejectionReason);
  }

  @Public()
  @Post("public/intake")
  async createPublicIntake(@Body() dto: PublicCustomerIntakeInput) {
    return this.ordersService.createPublicIntake(dto);
  }

  @Get()
  async findAll(
    @Query("status") status?: OrderStatus,
    @Query("search") search?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.ordersService.findAll(status, search, page, limit);
  }


  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.ordersService.findById(id);
  }

  @Roles(UserRole.ADMIN, UserRole.ATENDENTE)
  @Post()
  async create(@Body() dto: CreateServiceOrderInput, @CurrentUser("id") attendantId: string) {
    return this.ordersService.create(dto, attendantId);
  }

  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @Post(":id/items")
  async addItem(@Param("id") id: string, @Body() dto: AddOrderItemInput) {
    return this.ordersService.addItem(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.TECNICO)
  @Delete(":id/items/:itemId")
  async removeItem(@Param("id") id: string, @Param("itemId") itemId: string) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusInput,
    @CurrentUser("id") userId: string
  ) {
    return this.ordersService.updateStatus(
      id,
      dto.status,
      userId,
      dto.reason,
      dto.technicalReport
    );
  }
}
