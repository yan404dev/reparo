import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCategoryInput, UpdateCategoryInput } from "@fluxos/contracts";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.partCategory.findMany({
      include: {
        _count: {
          select: { parts: true }
        }
      },
      orderBy: { name: "asc" }
    });
  }

  async findById(id: string) {
    const category = await this.prisma.partCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { parts: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }

    return category;
  }

  async create(data: CreateCategoryInput) {
    const slug = data.slug || slugify(data.name);

    const existingName = await this.prisma.partCategory.findUnique({
      where: { name: data.name }
    });
    if (existingName) {
      throw new ConflictException("Já existe uma categoria com este nome");
    }

    const existingSlug = await this.prisma.partCategory.findUnique({
      where: { slug }
    });
    if (existingSlug) {
      throw new ConflictException("Já existe uma categoria com este slug");
    }

    return this.prisma.partCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        color: data.color || "#3B82F6"
      }
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    await this.findById(id);

    if (data.name) {
      const existingName = await this.prisma.partCategory.findFirst({
        where: { name: data.name, NOT: { id } }
      });
      if (existingName) {
        throw new ConflictException("Já existe outra categoria com este nome");
      }
    }

    const slug = data.slug || (data.name ? slugify(data.name) : undefined);
    if (slug) {
      const existingSlug = await this.prisma.partCategory.findFirst({
        where: { slug, NOT: { id } }
      });
      if (existingSlug) {
        throw new ConflictException("Já existe outra categoria com este slug");
      }
    }

    return this.prisma.partCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        color: data.color
      }
    });
  }

  async remove(id: string) {
    const category = await this.findById(id);

    const partsCount = await this.prisma.part.count({
      where: { categoryId: id }
    });

    if (partsCount > 0) {
      throw new BadRequestException("Não é possível remover categoria que possui peças vinculadas");
    }

    return this.prisma.partCategory.delete({
      where: { id }
    });
  }
}
