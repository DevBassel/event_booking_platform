import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileLogger } from 'typeorm/logger/FileLogger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        database: config.get('DB_NAME'),
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        entities: ['dist/**/*.entity.js'],
        logger:
          process.env.NODE_ENV === 'dev'
            ? new FileLogger('all', {
                logPath: './logs/DB.log',
              })
            : 'file',
        autoLoadEntities: true,
        logging: true,
        synchronize: config.get('DB_SYNC') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DBModule {}
