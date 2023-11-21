import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'path';
import { MulterFile } from 'multer';

@Injectable()
export class FileValidationService {
  async validateImage(image: MulterFile, text: MulterFile): Promise<void> {
    // Перевірка розширення для зображення
    if (image) {
      const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
      const imageExtension = extname(image.originalname).toLowerCase();

      if (!allowedImageExtensions.includes(imageExtension)) {
        throw new BadRequestException('Неприпустиме розширення зображення');
      }

      // Перевірка розміру файлу для зображення
      const maxImageSizeInBytes = 1024 * 1024 * 5; // 5 МБ

      if (image.size > maxImageSizeInBytes) {
        throw new BadRequestException('Розмір зображення перевищує 5 МБ');
      }
    }

    // Перевірка розширення для текстового файлу
    if (text) {
      const allowedTextExtensions = ['.txt'];
      const textExtension = extname(text.originalname).toLowerCase();

      if (!allowedTextExtensions.includes(textExtension)) {
        throw new BadRequestException(
          'Неприпустиме розширення текстового файлу',
        );
      }

      // Перевірка розміру файлу для текстового файлу
      const maxTextSizeInBytes = 100 * 1024; // 100 КБ

      if (text.size > maxTextSizeInBytes) {
        throw new BadRequestException(
          'Розмір текстового файлу перевищує 100 КБ',
        );
      }
    }
  }
}
