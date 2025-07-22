import {
  CommandInteraction,
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  AttachmentBuilder,
} from "discord.js";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import Bot from "@src/bot";
import { randomIntFromInterval } from "@src/utils/randomIntFromInterval";
import { createCanvas } from "@napi-rs/canvas";

const words: string[] = [
  "Солнышко",
  "Молодец",
  "Умничка",
  "Ранняя пташка",
  "Талантливый ребёнок",
  "Ничего страшного",
  "Мой человечек",
  "Любимый пользователь",
  "Звёздочка моя",
  "Солнечная птичка",
  "Феникс",
  "Лучик лучезарный",
  "Ты – бескрайнее море",
  "Всё будет хорошо",
  "Ты прекрасна, как природа",
  "Стойкий, как скала",
  "Такой один, дитя",
  "Котёнок",
  "Проблемы исчезают",
  "Стремись жить",
  "Оглянись",
];

export default class EncourageCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "encourage",
    description: "Returns encourage.",
    type: ApplicationCommandType.ChatInput,
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  private drawRes(str: string) {
    const canvas = createCanvas(800, 100);
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height,
    );
    gradient.addColorStop(0, "#8E369B");
    gradient.addColorStop(1, "#FF5147");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let fontSize = 50;
    ctx.font = fontSize + "px 'Rubik Mono One'";
    let text = ctx.measureText(str);
    while (text.width >= canvas.width - 60) {
      fontSize--;
      ctx.font = fontSize + "px 'Rubik Mono One'";
      text = ctx.measureText(str);
    }
    ctx.font = `${fontSize}px 'Rubik Mono One'`;
    text = ctx.measureText(str);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(
      str,
      canvas.width / 2 - text.width / 2,
      canvas.height / 2 + text.actualBoundingBoxAscent / 2,
    );

    return canvas.encode("png");
  }

  public async action(interaction: CommandInteraction) {
    const result = words[randomIntFromInterval(0, words.length - 1)];

    const attachment = new AttachmentBuilder(await this.drawRes(result), {
      name: "image.png",
    });

    await interaction.reply({
      ephemeral: true,
      files: [attachment],
    });
  }
}
