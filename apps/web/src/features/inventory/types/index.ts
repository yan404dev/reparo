import { PartDTO, StockMovementDTO } from "@fluxos/contracts";

export interface InventoryFilter {
  category: string;
  search: string;
}

export type PartItem = PartDTO;
export type MovementItem = StockMovementDTO;
