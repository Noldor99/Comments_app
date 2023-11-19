import { BadRequestException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { extname } from 'path';
import { MulterFile } from 'multer';

@Injectable()
export class FileValidationService {
  async validateImage(
    file: MulterFile,
    maxWidth: number,
    maxHeight: number,
  ): Promise<void> {
    // Перевірка розширення файлу
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('Неприпустиме розширення файлу');
    }

    // Перевірка розмірів зображення
    const imageDimensions = await sharp(file.buffer).metadata();

    if (
      imageDimensions.width > maxWidth ||
      imageDimensions.height > maxHeight
    ) {
      throw new BadRequestException(
        `Зображення повинно бути не більше ${maxWidth}x${maxHeight} пікселів`,
      );
    }
  }
}
