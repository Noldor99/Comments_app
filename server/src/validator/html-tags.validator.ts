import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'htmlTags', async: false })
export class HtmlTagsValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    // Дозволені HTML теги
    const allowedTags = ['a', 'code', 'i', 'strong'];

    // Збираємо всі теги з тексту
    const foundTags = text.match(/<\/?(\w+)[^>]*>/g);

    // Перевіряємо, чи всі знайдені теги є в списку дозволених
    const validTags =
      foundTags?.every((tag) => {
        const tagNameMatch = tag.match(/^<\/?(\w+)/);
        const tagName = tagNameMatch ? tagNameMatch[1] : '';

        if (!allowedTags.includes(tagName)) {
          return false;
        }

        // Перевірка правильності закриття тегів

        const openTag = `<${tagName}`;
        const closedTag = `</${tagName}`;
        const openTagCount = (text.match(new RegExp(openTag, 'g')) || [])
          .length;
        const closeTagCount = (text.match(new RegExp(closedTag, 'g')) || [])
          .length;

        // Порівнюємо кількість відкритих і закритих тегів

        return openTagCount === closeTagCount;
      }) ?? true;

    return validTags;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Дозволені тільки наступні HTML теги: <a>, <code>, <i>, <strong>. Текст повинен бути валідним XHTML.';
  }
}
