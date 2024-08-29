# Установка (б/у)

## 1. Зависимости

```bash
pnpm install
```

### 2. Окружение

```bash
cp .env.example .env
```

После выполнения команды в терминале, откройте файл `.env` и заполните поле "BOT_TOKEN".

Токен бота можно отыскать на [портале разработчика Discord](https://discord.com/developers/applications/) в профиле приложения во вкладке "BOT".

<table>
  <td width="50%">
    <img alt="Шаг 1" src="../assets/setup-1.png">
  </td>
  <td width="50%">
    <img alt="Шаг 2" src="../assets/setup-2.png">
  </td>
</table>

### 3. Запуск бота

```bash
pnpm kristy:start
```

## Расширенная настройка

[Продолжить чтение](./advanced.md)
