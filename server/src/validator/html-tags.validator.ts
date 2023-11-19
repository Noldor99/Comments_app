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
    const foundTags = text.match(/<\/?(\w+)([^>]*)>/g);

    // Перевіряємо, чи всі знайдені теги є в списку дозволених
    return (
      foundTags?.every((tag) =>
        allowedTags.includes(tag.replace(/[<\/>]/g, '')),
      ) ?? true
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Дозволені тільки наступні HTML теги: <a>, <code>, <i>, <strong>';
  }
}
