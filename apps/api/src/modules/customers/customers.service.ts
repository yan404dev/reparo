import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCustomerInput } from "@fluxos/contracts";

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.customer.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
              { document: { contains: search } },
            ],
          }
        : undefined,
      include: {
        devices: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        devices: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: { device: true },
        },
      },
    });
    if (!customer) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return customer;
  }

  async create(data: CreateCustomerInput) {
    if (data.document) {
      const existing = await this.prisma.customer.findUnique({
        where: { document: data.document },
      });
      if (existing) {
        throw new ConflictException("CPF/CNPJ já cadastrado");
      }
    }

    return this.prisma.customer.create({
      data,
      include: { devices: true },
    });
  }
}
