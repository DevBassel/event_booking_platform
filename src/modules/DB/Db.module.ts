import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileLogger } from 'typeorm/logger/FileLogger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: 'postgres',
        password: 'root',
        entities: ['dist/**/*.entity.js'],
        logger:
          process.env.NODE_ENV === 'dev'
            ? new FileLogger('all', {
                logPath: './logs/DB.log',
              })
            : 'file',
        autoLoadEntities: true,
        logging: true,
        synchronize: process.env.DB_SYNC === 'true',
      }),
    }),
  ],
})
export class DBModule {}
