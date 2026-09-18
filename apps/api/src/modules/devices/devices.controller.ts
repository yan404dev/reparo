import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DevicesService } from "./devices.service";
import { CreateDeviceInput } from "@fluxos/contracts";

@ApiTags("Aparelhos")
@ApiBearerAuth()
@Controller("devices")
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get()
  async findAll(
    @Query("search") search?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.devicesService.findAll(search, page, limit);
  }


  @Get("imei/:imei")
  async findByImei(@Param("imei") imei: string) {
    return this.devicesService.findByImei(imei);
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.devicesService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateDeviceInput) {
    return this.devicesService.create(dto);
  }
}
