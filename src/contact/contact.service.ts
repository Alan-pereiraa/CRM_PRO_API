import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

function removeMask(value: string) {
  return value.replace(/\D/g, '');
}

function normalizeSearchDigits(value: string) {
  return value.replace(/\D/g, '');
}

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

  async getContact(id: string, accountId: string) {
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

    return contact;
  }

  searchContacts(accountId: string, query: string) {
    const digitsOnlyQuery = normalizeSearchDigits(query);

    return this.prisma.contact.findMany({
      where: {
        project: {
          accountId,
        },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          ...(digitsOnlyQuery
            ? [
                {
                  phone: {
                    contains: digitsOnlyQuery,
                    mode: 'insensitive' as const,
                  },
                },
              ]
            : []),
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
    const normalizedData = {
      ...data,
      phone: removeMask(data.phone),
    };

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
        ...normalizedData,
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
    const normalizedData = {
      ...data,
      ...(data.phone !== undefined && { phone: removeMask(data.phone) }),
    };

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
          ...normalizedData,
          project: {
            connect: { id: projectId },
          },
        },
      });
    }

    return this.prisma.contact.update({
      where: { id },
      data: normalizedData,
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
