import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FunnelService } from './funnel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateFunnelDto } from './dto/create-funnel.dto';
import { UpdateFunnelDto } from './dto/update.funnel.dto';

@ApiTags('funnels')
@Controller('funnels')
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar funis',
    description: 'Retorna os funis do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Lista de funis retornada com sucesso.' })
  getFunnels(@Req() req) {
    const accountId = req.account.id;
    return this.funnelService.getFunnels(accountId);
  }

  @Get(':id/projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Projetos do funil',
    description: 'Retorna os projetos vinculados a um funil.',
  })
  @ApiOkResponse({ description: 'Projetos do funil retornados com sucesso.' })
  getFunnelProjects(@Param('id') id: string, @Req() req) {
    const accountId = req.account.id;
    return this.funnelService.getFunnelProjects(id, accountId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar funil',
    description: 'Retorna um funil pelo identificador.',
  })
  @ApiOkResponse({ description: 'Funil retornado com sucesso.' })
  getFunnelById(@Param('id') id: string, @Req() req) {
    const accountId = req.account.id;
    return this.funnelService.getFunnelById(id, accountId);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar funil',
    description: 'Cria um novo funil para o usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Funil criado com sucesso.' })
  createFunnel(@Req() req, @Body() funnelData: CreateFunnelDto) {
    const accountId = req.account.id;
    const payload = {
      ...funnelData,
      accountId,
    };

    return this.funnelService.createFunnel(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar funil',
    description: 'Atualiza os dados de um funil.',
  })
  @ApiOkResponse({ description: 'Funil atualizado com sucesso.' })
  updateFunnel(
    @Param('id') id: string,
    @Req() req,
    @Body() funnelData: UpdateFunnelDto,
  ) {
    const accountId = req.account.id;
    return this.funnelService.updateFunnel(id, accountId, funnelData);
  }

  @Patch(':id/position')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar posição do funil',
    description: 'Atualiza a ordem do funil na lista.',
  })
  @ApiOkResponse({ description: 'Posição do funil atualizada com sucesso.' })
  updateFunnelPosition(
    @Param('id') id: string,
    @Req() req,
    @Body('position') position: number,
  ) {
    const accountId = req.account.id;
    return this.funnelService.updateFunnelPosition(id, accountId, position);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir funil',
    description: 'Remove um funil do usuário autenticado.',
  })
  @ApiOkResponse({ description: 'Funil excluído com sucesso.' })
  deleteFunnel(@Param('id') id: string, @Req() req) {
    const accountId = req.account.id;
    return this.funnelService.deleteFunnel(id, accountId);
  }
}
