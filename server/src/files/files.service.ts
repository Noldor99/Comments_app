import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';

export enum FileType {
  TEXT = 'text',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  async createFile(type: FileType, file): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      if (file.mimetype.includes('image')) {
        // Якщо файл є зображенням, зменшуємо його розмір
        const resizedImageBuffer = await sharp(file.buffer)
          .resize({
            width: 320,
            height: 240,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toBuffer();

        // Збереження зменшеного зображення
        fs.writeFileSync(path.resolve(filePath, fileName), resizedImageBuffer);
      } else if (file.mimetype.includes('text/plain')) {
        // Збереження текстового файлу
        fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      } else {
        // Якщо файл не є зображенням або текстовим, ви можете обробити інші типи файлів за потреби.
        throw new HttpException(
          'Непідтримуваний тип файлу',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }

      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
