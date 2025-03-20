import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {
  private readonly filePath = path.join(__dirname, '../../data/clientes.json');

  saveDataToFile(data: any, p0: string): void {
    try {
      // 💡 Verificamos si la carpeta "data" existe, si no, la creamos
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 📄 Guardamos los datos en el archivo
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`✅ Archivo guardado correctamente en: ${this.filePath}`);
    } catch (error) {
      console.error('❌ Error al guardar el archivo:', error);
    }
  }
}
