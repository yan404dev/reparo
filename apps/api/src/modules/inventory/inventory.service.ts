import { CreateCompatibilityInput, CreatePartInput, StockEntryInput, StockScrapInput, UpdatePartInput, formatCurrency } from "@fluxos/contracts";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { StockMovementType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private formatPart = (part: any) => {
    const costPrice = Number(part.costPrice);
    const sellingPrice = Number(part.sellingPrice);
    const stockAvailable = part.stockPhysical - part.stockReserved;
    return {
      ...part,
      costPrice,
      suggestedMarkupPercent: Number(part.suggestedMarkupPercent),
      sellingPrice,
      displayCostPrice: formatCurrency(costPrice),
      displaySellingPrice: formatCurrency(sellingPrice),
      stockAvailable,
      isLowStock: stockAvailable <= part.minStockThreshold,
    };
  };

  async findAll(categoryId?: string, search?: string) {
    const parts = await this.prisma.part.findMany({
      where: {
        OR: search
          && [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
              { barcode: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
        ...(categoryId
         && {
              OR: [
                { categoryId },
                { category: { slug: categoryId } }
              ]
            }
          )
      },
      include: {
        category: true,
        compatibilities: true,
      },
      orderBy: { name: "asc" },
    });

    return parts.map(this.formatPart);
  }

  async findCompatible(deviceModel: string) {
    const cleanModel = deviceModel?.trim() || "";
    if (!cleanModel) {
      const parts = await this.prisma.part.findMany({
        include: { category: true },
        take: 30,
        orderBy: { name: "asc" },
      });
      return parts.map(this.formatPart);
    }

    const compatibilities = await this.prisma.partCompatibility.findMany({
      where: {
        deviceModel: { contains: cleanModel, mode: "insensitive" },
      },
      include: {
        part: {
          include: {
            category: true
          }
        },
      },
    });

    const directPartIds = compatibilities.map((c) => c.part.id);

    const nameMatchingParts = await this.prisma.part.findMany({
      where: {
        id: { notIn: directPartIds },
        name: { contains: cleanModel, mode: "insensitive" },
      },
      include: {
        category: true
      },
      take: 30,
    });

    return [
      ...compatibilities.map((c) => ({
        ...this.formatPart(c.part),
        compatibilityNotes: c.notes,
      })),
      ...nameMatchingParts.map((p) => this.formatPart(p)),
    ];
  }

  async findById(id: string) {
    const part = await this.prisma.part.findUnique({
      where: { id },
      include: {
        category: true,
        compatibilities: true,
        movements: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!part) {
      throw new NotFoundException("Peça não encontrada");
    }

    return this.formatPart(part);
  }

  async create(data: CreatePartInput) {
    const existingSku = await this.prisma.part.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      throw new ConflictException("SKU já cadastrado no sistema");
    }

    if (data.barcode) {
      const existingBarcode = await this.prisma.part.findUnique({ where: { barcode: data.barcode } });
      if (existingBarcode) {
        throw new ConflictException("Código de barras já cadastrado em outra peça");
      }
    }

    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const cat = await this.prisma.partCategory.findFirst({
        where: {
          OR: [{ id: data.category }, { slug: data.category }, { name: data.category }]
        }
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    if (!categoryId) {
      const defaultCategory = await this.prisma.partCategory.findFirst({
        orderBy: { createdAt: "asc" }
      });
      if (!defaultCategory) {
        throw new BadRequestException("Nenhuma categoria disponível no sistema");
      }
      categoryId = defaultCategory.id;
    }

    const { initialStock, category: _category, ...partData } = data;

    const markup = data.suggestedMarkupPercent ?? 50;
    const sellingPrice = data.sellingPrice ?? Number((data.costPrice * (1 + markup / 100)).toFixed(2));

    return this.prisma.$transaction(async (tx) => {
      const part = await tx.part.create({
        data: {
          sku: partData.sku,
          barcode: partData.barcode || null,
          name: partData.name,
          brand: partData.brand,
          categoryId,
          supplier: partData.supplier || null,
          description: partData.description || null,
          costPrice: partData.costPrice,
          suggestedMarkupPercent: markup,
          sellingPrice,
          stockPhysical: initialStock ?? 0,
          stockReserved: 0,
          minStockThreshold: partData.minStockThreshold ?? 3,
        },
        include: {
          category: true
        }
      });

      return this.formatPart(part);
    });
  }

  async update(id: string, data: UpdatePartInput) {
    const current = await this.findById(id);

    if (data.sku && data.sku !== current.sku) {
      const existingSku = await this.prisma.part.findUnique({ where: { sku: data.sku } });
      if (existingSku) {
        throw new ConflictException("SKU já cadastrado em outra peça");
      }
    }

    if (data.barcode && data.barcode !== current.barcode) {
      const existingBarcode = await this.prisma.part.findUnique({ where: { barcode: data.barcode } });
      if (existingBarcode) {
        throw new ConflictException("Código de barras já cadastrado em outra peça");
      }
    }

    let categoryId = data.categoryId ?? current.categoryId;
    if (data.category && !data.categoryId) {
      const cat = await this.prisma.partCategory.findFirst({
        where: {
          OR: [{ id: data.category }, { slug: data.category }, { name: data.category }]
        }
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    const costPrice = data.costPrice ?? Number(current.costPrice);
    const suggestedMarkupPercent = data.suggestedMarkupPercent ?? Number(current.suggestedMarkupPercent);
    let sellingPrice = data.sellingPrice;

    if (!sellingPrice && data.costPrice) {
      sellingPrice = Number((costPrice * (1 + suggestedMarkupPercent / 100)).toFixed(2));
    }

    const updated = await this.prisma.part.update({
      where: { id },
      data: {
        sku: data.sku,
        barcode: data.barcode !== undefined ? data.barcode : undefined,
        name: data.name,
        brand: data.brand,
        categoryId,
        supplier: data.supplier !== undefined ? data.supplier : undefined,
        description: data.description !== undefined ? data.description : undefined,
        costPrice: data.costPrice,
        suggestedMarkupPercent: data.suggestedMarkupPercent,
        sellingPrice,
        minStockThreshold: data.minStockThreshold,
      },
      include: {
        category: true,
        compatibilities: true
      }
    });

    return this.formatPart(updated);
  }

  async createCompatibility(data: CreateCompatibilityInput) {
    const existing = await this.prisma.partCompatibility.findUnique({
      where: {
        partId_deviceBrand_deviceModel: {
          partId: data.partId,
          deviceBrand: data.deviceBrand,
          deviceModel: data.deviceModel,
        },
      },
    });

    if (existing) {
      throw new ConflictException("Compatibilidade já cadastrada para esta peça e modelo");
    }

    return this.prisma.partCompatibility.create({ data });
  }

  async registerEntry(data: StockEntryInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const [part] = await tx.$queryRaw<any[]>`
        SELECT * FROM "parts" WHERE id = ${data.partId} FOR UPDATE
      `;

      if (!part) {
        throw new NotFoundException("Peça não encontrada");
      }

      const updatedPart = await tx.part.update({
        where: { id: data.partId },
        data: {
          stockPhysical: { increment: data.quantity },
          costPrice: data.costPrice ? data.costPrice : undefined,
        },
        include: {
          category: true
        }
      });

      await tx.stockMovement.create({
        data: {
          partId: part.id,
          userId,
          type: StockMovementType.ENTRADA,
          quantity: data.quantity,
          previousPhysical: part.stockPhysical,
          newPhysical: updatedPart.stockPhysical,
          previousReserved: part.stockReserved,
          newReserved: updatedPart.stockReserved,
          reason: data.reason,
        },
      });

      return this.formatPart(updatedPart);
    });
  }

  async registerScrap(data: StockScrapInput, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const [part] = await tx.$queryRaw<any[]>`
        SELECT * FROM "parts" WHERE id = ${data.partId} FOR UPDATE
      `;

      if (!part) {
        throw new NotFoundException("Peça não encontrada");
      }

      const currentAvailable = part.stockPhysical - part.stockReserved;
      if (currentAvailable < data.quantity) {
        throw new BadRequestException("Saldo físico disponível insuficiente para baixa por sucata");
      }

      const updatedPart = await tx.part.update({
        where: { id: data.partId },
        data: {
          stockPhysical: { decrement: data.quantity },
        },
        include: {
          category: true
        }
      });

      await tx.stockMovement.create({
        data: {
          partId: part.id,
          serviceOrderId: data.serviceOrderId || undefined,
          userId,
          type: StockMovementType.PERDA_SUCATA,
          quantity: -data.quantity,
          previousPhysical: part.stockPhysical,
          newPhysical: updatedPart.stockPhysical,
          previousReserved: part.stockReserved,
          newReserved: updatedPart.stockReserved,
          reason: data.reason,
        },
      });

      return this.formatPart(updatedPart);
    });
  }

  async getMovements(partId?: string) {
    return this.prisma.stockMovement.findMany({
      where: partId ? { partId } : undefined,
      include: {
        part: { select: { id: true, name: true, sku: true } },
        user: { select: { id: true, name: true, email: true } },
        serviceOrder: { select: { id: true, orderNumber: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
