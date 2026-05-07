import {
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
import { ContactService } from './contact.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getContacts(@Req() req) {
    return this.contactService.getContacts(req.account.id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getContact(@Param('id') id: string, @Req() req) {
    return this.contactService.getContact(id, req.account.id);
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  searchContacts(@Req() req, @Query('q') query: string) {
    return this.contactService.searchContacts(req.account.id, query);
  }

  @Get('/projects/:projectId')
  @UseGuards(JwtAuthGuard)
  getContactsByProject(@Param('projectId') projectId: string, @Req() req) {
    return this.contactService.getContactsByProject(projectId, req.account.id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createContact(@Body() contactData: CreateContactDto, @Req() req) {
    return this.contactService.createContact(contactData, req.account.id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  updateContact(
    @Param('id') id: string,
    @Body() contactData: UpdateContactDto,
    @Req() req,
  ) {
    return this.contactService.updateContact(id, contactData, req.account.id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteContact(@Param('id') id: string, @Req() req) {
    return this.contactService.deleteContact(id, req.account.id);
  }
}
