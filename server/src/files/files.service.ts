import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = uuid.v4() + path.extname(file.originalname);
      const filePath = path.resolve(__dirname, '..', '..', 'static');

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
        fs.writeFileSync(path.join(filePath, fileName), resizedImageBuffer);
      } else if (file.mimetype.includes('text/plain')) {
        // Якщо файл є текстовим, перевіряємо його розмір
        const maxSize = 100 * 1024; // 100 кБ
        if (file.size > maxSize) {
          throw new HttpException(
            'Розмір текстового файлу перевищує 100 кБ',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Збереження текстового файлу
        fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      } else {
        // Якщо файл не є зображенням або текстовим, ви можете обробити інші типи файлів за потреби.
        throw new HttpException(
          'Непідтримуваний тип файлу',
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        );
      }

      return fileName;
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
