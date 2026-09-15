import { CustomerDTO } from "@fluxos/contracts";

export type CustomerItem = CustomerDTO;

export interface CustomersFilter {
  search: string;
}
