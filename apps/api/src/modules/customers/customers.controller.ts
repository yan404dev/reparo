import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomersService } from "./customers.service";
import { CreateCustomerInput } from "@fluxos/contracts";

@ApiTags("Clientes")
@ApiBearerAuth()
@Controller("customers")
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async findAll(@Query("search") search?: string) {
    return this.customersService.findAll(search);
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.customersService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCustomerInput) {
    return this.customersService.create(dto);
  }
}
