import { PrinterColors } from "./libs/Printer";

const todo = [
  {
    name: "Мигратор-1",
    description:
      "Мигратор активностей для версии бота 1.0.4 и выше (группированные).",
    color: PrinterColors.success,
  },
  {
    name: "Парсер-1",
    description: "Парсер заполнителей активностей.",
    color: PrinterColors.error,
  },
  {
    name: "Парсер-2",
    description: "Парсер типов активностей для версии бота 2.0.0 и выше.",
    color: PrinterColors.error,
  },
  {
    name: "Активности",
    description:
      'Не забудь сделать систему активностей! (связано с "Парсер-[1, 2]").',
    color: PrinterColors.error,
    steps: [1, 4],
  },
  {
    name: "Проверка обновлений",
    description:
      "Должен проверять обновление репозитория. Выводить список изменений в консоль.",
    color: PrinterColors.warning,
    steps: [1, 2],
  },
  {
    name: "Языковые файлы",
    description: "Файлы с переводом терминала, команд и другого.",
    color: PrinterColors.error,
    steps: [1, 4],
  },
];
export default todo;
