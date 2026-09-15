import React from "react";
import Link from "next/link";
import { AlertCircle, Clock, Smartphone, FileText } from "lucide-react";
import { CustomerDTO } from "@fluxos/contracts";
import { serverApiFetch } from "@/lib/server-api";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { CustomerHeader } from "@/features/customers/components/customer-header";
import { CustomerKpis } from "@/features/customers/components/customer-kpis";
import { CustomerTimelapsePlayer } from "@/features/customers/components/customer-timelapse-player";
import { CustomerDevicesTab } from "@/features/customers/components/customer-devices-tab";
import { CustomerOrdersTab } from "@/features/customers/components/customer-orders-tab";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  let customer: CustomerDTO | null = null;
  try {
    customer = await serverApiFetch<CustomerDTO>(`/customers/${id}`);
  } catch (error) {
    customer = null;
  }

  if (!customer) {
    return (
      <div className="space-y-4 max-w-lg mx-auto text-center py-12">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Cliente não encontrado</h2>
        <p className="text-sm text-muted-foreground">
          O cliente solicitado não existe ou pode ter sido removido.
        </p>
        <Button variant="outline" asChild>
          <Link href="/customers">Voltar para a Lista de Clientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <CustomerHeader customer={customer} />
      <CustomerKpis customer={customer} />

      <Tabs defaultValue="timelapse" className="w-full">
        <TabsList className="bg-muted/70 p-1 rounded-lg">
          <TabsTrigger value="timelapse" className="text-xs font-semibold gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Timelapse & Histórico ({customer.timelineEvents?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="text-xs font-semibold gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Aparelhos Registrados ({customer.devices?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs font-semibold gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Todas as Ordens ({customer.orders?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timelapse" className="space-y-6 pt-2">
          <CustomerTimelapsePlayer timelineEvents={customer.timelineEvents || []} />
        </TabsContent>

        <TabsContent value="devices" className="space-y-4 pt-2">
          <CustomerDevicesTab devices={customer.devices} customerDocument={customer.document} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 pt-2">
          <CustomerOrdersTab orders={customer.orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
