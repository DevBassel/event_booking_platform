import { Module } from '@nestjs/common';
import { DBModule } from './modules/DB/Db.module';

@Module({
  imports: [DBModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
