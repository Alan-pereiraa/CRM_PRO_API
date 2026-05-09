import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar contatos',
    description: 'Retorna os contatos do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Lista de contatos retornada com sucesso.' })
  getContacts(@Req() req) {
    return this.contactService.getContacts(req.account.id);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar contatos',
    description: 'Pesquisa contatos pelo texto informado em q.',
  })
  @ApiOkResponse({ description: 'Pesquisa de contatos retornada com sucesso.' })
  searchContacts(@Req() req, @Query('q') query: string) {
    if (!query?.trim()) {
      throw new BadRequestException('Parâmetro q é obrigatório');
    }

    return this.contactService.searchContacts(req.account.id, query);
  }

  @Get('/projects/:projectId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Contatos por projeto',
    description: 'Retorna os contatos vinculados a um projeto.',
  })
  @ApiOkResponse({ description: 'Contatos do projeto retornados com sucesso.' })
  getContactsByProject(@Param('projectId') projectId: string, @Req() req) {
    return this.contactService.getContactsByProject(projectId, req.account.id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar contato',
    description: 'Retorna um contato pelo identificador.',
  })
  @ApiOkResponse({ description: 'Contato retornado com sucesso.' })
  getContact(@Param('id') id: string, @Req() req) {
    return this.contactService.getContact(id, req.account.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar contato',
    description: 'Cria um novo contato para o usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Contato criado com sucesso.' })
  createContact(@Body() contactData: CreateContactDto, @Req() req) {
    return this.contactService.createContact(contactData, req.account.id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar contato',
    description: 'Atualiza os dados de um contato.',
  })
  @ApiOkResponse({ description: 'Contato atualizado com sucesso.' })
  updateContact(
    @Param('id') id: string,
    @Body() contactData: UpdateContactDto,
    @Req() req,
  ) {
    return this.contactService.updateContact(id, contactData, req.account.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir contato',
    description: 'Remove um contato do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Contato excluído com sucesso.' })
  deleteContact(@Param('id') id: string, @Req() req) {
    return this.contactService.deleteContact(id, req.account.id);
  }
}
