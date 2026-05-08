import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOverview(@Req() req) {
    return await this.dashboardService.getOverView(req.account.id);
  }
}
