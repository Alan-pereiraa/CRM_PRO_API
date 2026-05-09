import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Visão geral',
    description: 'Retorna os indicadores principais do dashboard.',
  })
  @ApiOkResponse({ description: 'Visão geral retornada com sucesso.' })
  async getOverview(@Req() req) {
    return await this.dashboardService.getOverView(req.account.id);
  }
}
