import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";

import { PricingCalculatorService } from "./services/pricing-calculator.service";
import { WhatsAppBuilderService } from "./services/whatsapp-builder.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PricingCalculatorService, WhatsAppBuilderService],
  exports: [OrdersService, PricingCalculatorService, WhatsAppBuilderService],
})
export class OrdersModule {}
