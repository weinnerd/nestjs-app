import { Module } from '@nestjs/common';
import { VtexController } from './controllers/vtex.controller';
import { VtexService } from './services/vtex.service';
import { FileHelper } from './utils/file.helper'; // <- Importa FileHelper

@Module({
  controllers: [VtexController],
  providers: [VtexService, FileHelper], // <- Agregar aquí
})
export class AppModule {}
