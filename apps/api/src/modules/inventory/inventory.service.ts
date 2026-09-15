import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePartInput, UpdatePartInput, CreateCompatibilityInput, StockEntryInput, StockScrapInput } from "@fluxos/contracts";
import { StockMovementType } from "@prisma/client";

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, search?: string) {
    const parts = await this.prisma.part.findMany({
      where: {
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
              { barcode: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
        ...(categoryId
          ? {
              OR: [
                { categoryId },
                { category: { slug: categoryId } }
              ]
            }
          : {})
      },
      include: {
        category: true,
        compatibilities: true,
      },
      orderBy: { name: "asc" },
    });

    return parts.map((part) => ({
      ...part,
      costPrice: Number(part.costPrice),
      suggestedMarkupPercent: Number(part.suggestedMarkupPercent),
      sellingPrice: Number(part.sellingPrice),
      stockAvailable: part.stockPhysical - part.stockReserved,
    }));
  }

  async findCompatible(deviceModel: string) {
    const compatibilities = await this.prisma.partCompatibility.findMany({
      where: {
        deviceModel: { contains: deviceModel, mode: "insensitive" },
      },
      include: {
        part: {
          include: {
            category: true
          }
        },
      },
    });

    return compatibilities.map((c) => ({
      ...c.part,
      costPrice: Number(c.part.costPrice),
      suggestedMarkupPercent: Number(c.part.suggestedMarkupPercent),
      sellingPrice: Number(c.part.sellingPrice),
      stockAvailable: c.part.stockPhysical - c.part.stockReserved,
      compatibilityNotes: c.notes,
    }));
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

    return {
      ...part,
      costPrice: Number(part.costPrice),
      suggestedMarkupPercent: Number(part.suggestedMarkupPercent),
      sellingPrice: Number(part.sellingPrice),
      stockAvailable: part.stockPhysical - part.stockReserved,
    };
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

      return {
        ...part,
        costPrice: Number(part.costPrice),
        suggestedMarkupPercent: Number(part.suggestedMarkupPercent),
        sellingPrice: Number(part.sellingPrice),
        stockAvailable: part.stockPhysical - part.stockReserved,
      };
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

    return {
      ...updated,
      costPrice: Number(updated.costPrice),
      suggestedMarkupPercent: Number(updated.suggestedMarkupPercent),
      sellingPrice: Number(updated.sellingPrice),
      stockAvailable: updated.stockPhysical - updated.stockReserved,
    };
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

      return {
        ...updatedPart,
        costPrice: Number(updatedPart.costPrice),
        suggestedMarkupPercent: Number(updatedPart.suggestedMarkupPercent),
        sellingPrice: Number(updatedPart.sellingPrice),
        stockAvailable: updatedPart.stockPhysical - updatedPart.stockReserved,
      };
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

      return {
        ...updatedPart,
        costPrice: Number(updatedPart.costPrice),
        suggestedMarkupPercent: Number(updatedPart.suggestedMarkupPercent),
        sellingPrice: Number(updatedPart.sellingPrice),
        stockAvailable: updatedPart.stockPhysical - updatedPart.stockReserved,
      };
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
