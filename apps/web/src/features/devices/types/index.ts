import { DeviceDTO } from "@fluxos/contracts";

export type DeviceItem = DeviceDTO;

export interface DevicesFilter {
  search: string;
}
