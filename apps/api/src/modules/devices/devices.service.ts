import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDeviceInput } from "@fluxos/contracts";
import { buildPaginatedResponse } from "../../common/utils/pagination.util";

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, page?: number, limit?: number) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const where = search
      ? {
          OR: [
            { imei: { contains: search } },
            { model: { contains: search, mode: "insensitive" as const } },
            { brand: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [total, devices] = await Promise.all([
      this.prisma.device.count({ where }),
      this.prisma.device.findMany({
        where,
        include: {
          customer: true,
          orders: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
      }),
    ]);

    return buildPaginatedResponse(devices, total, safePage, safeLimit);
  }


  async findByImei(imei: string) {
    const device = await this.prisma.device.findUnique({
      where: { imei },
      include: {
        customer: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });
    if (!device) {
      throw new NotFoundException("Aparelho não encontrado com este IMEI");
    }
    return device;
  }

  async findById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        customer: true,
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!device) {
      throw new NotFoundException("Aparelho não encontrado");
    }
    return device;
  }

  async create(data: CreateDeviceInput) {
    const existing = await this.prisma.device.findUnique({
      where: { imei: data.imei },
    });
    if (existing) {
      throw new ConflictException("Aparelho com este IMEI já cadastrado");
    }

    return this.prisma.device.create({
      data,
      include: { customer: true },
    });
  }
}
