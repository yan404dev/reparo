import { PrismaClient, UserRole, OrderStatus, OrderItemType, StockMovementType } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.stockMovement.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.serviceOrderItem.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.partCompatibility.deleteMany();
  await prisma.part.deleteMany();
  await prisma.partCategory.deleteMany();
  await prisma.device.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador Reparô",
      email: "admin@fluxos.com",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  const tech = await prisma.user.create({
    data: {
      name: "Carlos Técnico",
      email: "carlos@fluxos.com",
      passwordHash,
      role: UserRole.TECNICO
    }
  });

  const attendant = await prisma.user.create({
    data: {
      name: "Marina Atendente",
      email: "marina@fluxos.com",
      passwordHash,
      role: UserRole.ATENDENTE
    }
  });

  const catScreens = await prisma.partCategory.create({
    data: {
      name: "Telas OLED / Incell",
      slug: "telas",
      description: "Telas completas, módulos OLED, LCD e Incell",
      color: "#3b82f6"
    }
  });

  const catBatteries = await prisma.partCategory.create({
    data: {
      name: "Baterias Premium",
      slug: "baterias",
      description: "Baterias de cobalto e tecnologia OEM",
      color: "#10b981"
    }
  });

  const catConnectors = await prisma.partCategory.create({
    data: {
      name: "Conectores de Carga",
      slug: "conectores",
      description: "Flex de carga Lightning e USB-C com microfones",
      color: "#f59e0b"
    }
  });

  const catCameras = await prisma.partCategory.create({
    data: {
      name: "Câmeras & Lentes",
      slug: "cameras",
      description: "Módulos de câmera traseira, frontal e TrueDepth",
      color: "#8b5cf6"
    }
  });

  const catCasings = await prisma.partCategory.create({
    data: {
      name: "Carcaças & Vidros",
      slug: "carcacas",
      description: "Chassis em alumínio/aço e vidros traseiros",
      color: "#ec4899"
    }
  });

  const catChips = await prisma.partCategory.create({
    data: {
      name: "Circuitos & Chips",
      slug: "chips",
      description: "CIs de carga (Tristar/Hydra), PMIC e codecs de áudio",
      color: "#6366f1"
    }
  });

  const catInsumos = await prisma.partCategory.create({
    data: {
      name: "Insumos de Bancada",
      slug: "insumos",
      description: "Fluxo de solda, malha dessoldadora, fita kapton e colas B7000",
      color: "#64748b"
    }
  });

  const customer1 = await prisma.customer.create({
    data: {
      name: "João Silva",
      document: "123.456.789-01",
      email: "joao.silva@email.com",
      phone: "(11) 98888-7777",
      notes: "Cliente VIP, prefere peças originais"
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Ana Souza",
      document: "987.654.321-00",
      email: "ana.souza@email.com",
      phone: "(11) 97777-6666"
    }
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Lucas Pereira",
      document: "555.444.333-22",
      email: "lucas.pereira@email.com",
      phone: "(11) 96666-5555"
    }
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: "Beatriz Mendes",
      document: "333.222.111-99",
      email: "beatriz.mendes@email.com",
      phone: "(11) 95555-4444"
    }
  });

  const device1 = await prisma.device.create({
    data: {
      customerId: customer1.id,
      brand: "Apple",
      model: "iPhone 13",
      imei: "357890123456789",
      serialNumber: "F17D98K0M1",
      color: "Azul Meia-Noite",
      passcode: "123456",
      notes: "Pequenos riscos na moldura lateral"
    }
  });

  const device2 = await prisma.device.create({
    data: {
      customerId: customer2.id,
      brand: "Apple",
      model: "iPhone 14 Pro",
      imei: "358901234567890",
      serialNumber: "G28E12L1N2",
      color: "Roxo Profundo",
      passcode: "998877",
      notes: "Vidro frontal estilhaçado após queda"
    }
  });

  const device3 = await prisma.device.create({
    data: {
      customerId: customer3.id,
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      imei: "359012345678901",
      serialNumber: "H39F23M2O3",
      color: "Titânio Natural",
      passcode: "112233"
    }
  });

  const device4 = await prisma.device.create({
    data: {
      customerId: customer4.id,
      brand: "Apple",
      model: "iPhone 12",
      imei: "356789012345678",
      serialNumber: "E16C87J9L0",
      color: "Verde Claro",
      passcode: "445566"
    }
  });

  const partScreen13 = await prisma.part.create({
    data: {
      sku: "TELA-IPH13-OLED",
      barcode: "7891001001",
      name: "Tela OLED iPhone 13 Original Importada",
      brand: "Apple",
      categoryId: catScreens.id,
      supplier: "Distribuidora TechParts",
      description: "Display OLED Super Retina XDR com suporte a TrueTone",
      costPrice: 350.00,
      suggestedMarkupPercent: 125.00,
      sellingPrice: 790.00,
      stockPhysical: 14,
      stockReserved: 2,
      minStockThreshold: 4
    }
  });

  const partBattery13 = await prisma.part.create({
    data: {
      sku: "BAT-IPH13-OEM",
      barcode: "7891001002",
      name: "Bateria iPhone 13 3227mAh OEM Premium",
      brand: "Apple",
      categoryId: catBatteries.id,
      supplier: "Global Power Baterias",
      description: "Célula de cobalto puro com chip de gestão de saúde",
      costPrice: 110.00,
      suggestedMarkupPercent: 154.00,
      sellingPrice: 280.00,
      stockPhysical: 20,
      stockReserved: 1,
      minStockThreshold: 5
    }
  });

  const partScreen14P = await prisma.part.create({
    data: {
      sku: "TELA-IPH14P-OLED",
      barcode: "7891001003",
      name: "Tela OLED iPhone 14 Pro 120Hz ProMotion",
      brand: "Apple",
      categoryId: catScreens.id,
      supplier: "Distribuidora TechParts",
      description: "Tela com Dynamic Island e ProMotion 120Hz original",
      costPrice: 680.00,
      suggestedMarkupPercent: 119.00,
      sellingPrice: 1490.00,
      stockPhysical: 6,
      stockReserved: 1,
      minStockThreshold: 3
    }
  });

  const partBattery15PM = await prisma.part.create({
    data: {
      sku: "BAT-IPH15PM-OEM",
      barcode: "7891001004",
      name: "Bateria iPhone 15 Pro Max 4422mAh",
      brand: "Apple",
      categoryId: catBatteries.id,
      supplier: "Global Power Baterias",
      description: "Compatível com carga rápida USB-C e MagSafe",
      costPrice: 180.00,
      suggestedMarkupPercent: 133.00,
      sellingPrice: 420.00,
      stockPhysical: 8,
      stockReserved: 0,
      minStockThreshold: 3
    }
  });

  const partPortLightning = await prisma.part.create({
    data: {
      sku: "FLEX-CARGA-IPH12",
      barcode: "7891001005",
      name: "Flex de Carga Lightning iPhone 12 / 12 Pro",
      brand: "Apple",
      categoryId: catConnectors.id,
      supplier: "Mega Eletrônicos",
      description: "Módulo conector Lightning, microfone e antena",
      costPrice: 45.00,
      suggestedMarkupPercent: 322.00,
      sellingPrice: 190.00,
      stockPhysical: 12,
      stockReserved: 0,
      minStockThreshold: 3
    }
  });

  await prisma.partCompatibility.createMany({
    data: [
      { partId: partScreen13.id, deviceBrand: "Apple", deviceModel: "iPhone 13" },
      { partId: partBattery13.id, deviceBrand: "Apple", deviceModel: "iPhone 13" },
      { partId: partScreen14P.id, deviceBrand: "Apple", deviceModel: "iPhone 14 Pro" },
      { partId: partBattery15PM.id, deviceBrand: "Apple", deviceModel: "iPhone 15 Pro Max" },
      { partId: partPortLightning.id, deviceBrand: "Apple", deviceModel: "iPhone 12" },
      { partId: partPortLightning.id, deviceBrand: "Apple", deviceModel: "iPhone 12 Pro", notes: "Compatibilidade cruzada total" }
    ]
  });

  const order1 = await prisma.serviceOrder.create({
    data: {
      publicToken: "token-os-joao-silva-13",
      customerId: customer1.id,
      deviceId: device1.id,
      technicianId: tech.id,
      attendantId: attendant.id,
      status: OrderStatus.APROVADA,
      reportedDefect: "Aparelho não segura carga e desliga com 20%",
      technicalReport: "Bateria degradada a 72% com ciclos estourados. Necessária substituição.",
      entryChecklist: {
        screenBroken: false,
        touchWorks: true,
        faceIdWorking: true,
        camerasOk: true,
        audioOk: true,
        chargePortWorking: true,
        batteryHealth: 72,
        casingCondition: "BOM",
        cosmeticPhotos: []
      },
      totalPartsPrice: 280.00,
      totalLaborPrice: 120.00,
      grandTotal: 400.00,
      approvedAt: new Date(Date.now() - 3600000 * 24),
      startedAt: new Date(Date.now() - 3600000 * 18)
    }
  });

  await prisma.serviceOrderItem.createMany({
    data: [
      {
        serviceOrderId: order1.id,
        type: OrderItemType.PECA,
        partId: partBattery13.id,
        description: "Bateria iPhone 13 3227mAh OEM",
        quantity: 1,
        unitCost: 110.00,
        unitPrice: 280.00,
        total: 280.00,
        warrantyDays: 90
      },
      {
        serviceOrderId: order1.id,
        type: OrderItemType.SERVICO_MAO_DE_OBRA,
        description: "Mão de obra: Substituição de bateria e restauração de vedação IP68",
        quantity: 1,
        unitCost: 0.00,
        unitPrice: 120.00,
        total: 120.00,
        warrantyDays: 90
      }
    ]
  });

  const orderOverdue = await prisma.serviceOrder.create({
    data: {
      publicToken: "token-os-lucas-pereira-overdue",
      customerId: customer3.id,
      deviceId: device3.id,
      technicianId: tech.id,
      attendantId: attendant.id,
      status: OrderStatus.PRONTO_RETIRADA,
      reportedDefect: "Bateria estufada pressionando display",
      technicalReport: "Troca preventiva executada e testes de bancada 100% aprovados.",
      entryChecklist: {
        screenBroken: false,
        touchWorks: true,
        faceIdWorking: true,
        camerasOk: true,
        audioOk: true,
        chargePortWorking: true,
        batteryHealth: 68,
        casingCondition: "PERFEITO",
        cosmeticPhotos: []
      },
      totalPartsPrice: 420.00,
      totalLaborPrice: 150.00,
      grandTotal: 570.00,
      approvedAt: new Date(Date.now() - 3600000 * 96),
      startedAt: new Date(Date.now() - 3600000 * 80),
      finishedAt: new Date(Date.now() - 3600000 * 74),
      readyAt: new Date(Date.now() - 3600000 * 72)
    }
  });

  await prisma.serviceOrderItem.createMany({
    data: [
      {
        serviceOrderId: orderOverdue.id,
        type: OrderItemType.PECA,
        partId: partBattery15PM.id,
        description: "Bateria iPhone 15 Pro Max 4422mAh",
        quantity: 1,
        unitCost: 180.00,
        unitPrice: 420.00,
        total: 420.00,
        warrantyDays: 90
      },
      {
        serviceOrderId: orderOverdue.id,
        type: OrderItemType.SERVICO_MAO_DE_OBRA,
        description: "Mão de obra e calibração de BMS",
        quantity: 1,
        unitCost: 0.00,
        unitPrice: 150.00,
        total: 150.00,
        warrantyDays: 90
      }
    ]
  });

  const order2 = await prisma.serviceOrder.create({
    data: {
      publicToken: "token-os-ana-souza-14p",
      customerId: customer2.id,
      deviceId: device2.id,
      technicianId: tech.id,
      attendantId: attendant.id,
      status: OrderStatus.AGUARDANDO_APROVACAO,
      reportedDefect: "Tela sem imagem após impacto no canto superior",
      technicalReport: "Display interno OLED rompido. Necessária troca completa do módulo frontal.",
      entryChecklist: {
        screenBroken: true,
        touchWorks: false,
        faceIdWorking: true,
        camerasOk: true,
        audioOk: true,
        chargePortWorking: true,
        batteryHealth: 88,
        casingCondition: "TRINCADO",
        cosmeticPhotos: []
      },
      totalPartsPrice: 1490.00,
      totalLaborPrice: 200.00,
      grandTotal: 1690.00
    }
  });

  await prisma.serviceOrderItem.createMany({
    data: [
      {
        serviceOrderId: order2.id,
        type: OrderItemType.PECA,
        partId: partScreen14P.id,
        description: "Tela OLED iPhone 14 Pro 120Hz ProMotion",
        quantity: 1,
        unitCost: 680.00,
        unitPrice: 1490.00,
        total: 1490.00,
        warrantyDays: 90
      },
      {
        serviceOrderId: order2.id,
        type: OrderItemType.SERVICO_MAO_DE_OBRA,
        description: "Mão de obra especializada: Transplante de IC de tela e TrueTone EEPROM",
        quantity: 1,
        unitCost: 0.00,
        unitPrice: 200.00,
        total: 200.00,
        warrantyDays: 90
      }
    ]
  });

  await prisma.stockMovement.create({
    data: {
      partId: partBattery13.id,
      serviceOrderId: order1.id,
      userId: tech.id,
      type: StockMovementType.RESERVA,
      quantity: 1,
      previousPhysical: 20,
      newPhysical: 20,
      previousReserved: 0,
      newReserved: 1,
      reason: "Reserva de peça para OS #1 (Aprovada pelo cliente)"
    }
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        serviceOrderId: order1.id,
        changedById: attendant.id,
        fromStatus: OrderStatus.CRIADA,
        toStatus: OrderStatus.AGUARDANDO_APROVACAO,
        reason: "Orçamento emitido para o cliente"
      },
      {
        serviceOrderId: order1.id,
        changedById: tech.id,
        fromStatus: OrderStatus.AGUARDANDO_APROVACAO,
        toStatus: OrderStatus.APROVADA,
        reason: "Aprovado via WhatsApp pelo cliente"
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
