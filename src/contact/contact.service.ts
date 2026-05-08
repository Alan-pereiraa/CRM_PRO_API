import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  getContacts(accountId: string) {
    return this.prisma.contact.findMany({
      where: {
        project: {
          accountId,
        },
      },
    });
  }

  getContact(id: string, accountId: string) {
    return this.prisma.contact.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });
  }

  searchContacts(accountId: string, query: string) {
    return this.prisma.contact.findMany({
      where: {
        project: {
          accountId,
        },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  getContactsByProject(projectId: string, accountId: string) {
    return this.prisma.contact.findMany({
      where: {
        projectId,
        project: {
          accountId,
        },
      },
    });
  }

  async createContact(contactData: CreateContactDto, accountId: string) {
    const { projectId, ...data } = contactData;

    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        accountId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.contact.create({
      data: {
        ...data,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  async updateContact(
    id: string,
    contactData: UpdateContactDto,
    accountId: string,
  ) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contato não encontrado');
    }

    const { projectId, ...data } = contactData;

    if (projectId) {
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          accountId,
        },
      });

      if (!project) {
        throw new NotFoundException('Projeto não encontrado');
      }

      return this.prisma.contact.update({
        where: { id },
        data: {
          ...data,
          project: {
            connect: { id: projectId },
          },
        },
      });
    }

    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async deleteContact(id: string, accountId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        project: {
          accountId,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contato não encontrado');
    }

    return this.prisma.contact.delete({
      where: { id },
    });
  }
}
