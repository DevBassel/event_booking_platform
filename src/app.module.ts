import { Module } from '@nestjs/common';
import { DBModule } from './modules/DB/Db.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'pino-nestjs';

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
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.development.env' }),
    DBModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
