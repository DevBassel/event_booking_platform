import { Module } from '@nestjs/common';
import { DBModule } from './modules/DB/Db.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'pino-nestjs';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PlansModule } from './modules/plans/plans.module';
import { EventsModule } from './modules/events/events.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino/file',
          options: { destination: './logs/app.log' },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    DBModule,
    AuthModule,
    UsersModule,
    OrganizationModule,
    PlansModule,
    EventsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
