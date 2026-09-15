import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { RolesGuard } from "../../common/guards/roles.guard";

@ApiTags("Dashboard")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get("metrics")
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }
}
