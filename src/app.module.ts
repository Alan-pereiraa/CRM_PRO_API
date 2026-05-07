import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { FunnelModule } from './funnel/funnel.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [AuthModule, PrismaModule, DashboardModule, FunnelModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
