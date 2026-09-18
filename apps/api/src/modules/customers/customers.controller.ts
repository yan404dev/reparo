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
  async findAll(
    @Query("search") search?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.customersService.findAll(search, page, limit);
  }


  @Get("by-document/:document")
  async findByDocument(@Param("document") document: string) {
    return this.customersService.findByDocument(document);
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
