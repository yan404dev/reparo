import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDeviceInput } from "@fluxos/contracts";

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.device.findMany({
      where: search
        ? {
            OR: [
              { imei: { contains: search } },
              { model: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        customer: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });
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
