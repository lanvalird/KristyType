import {
  CommandInteraction,
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} from "discord.js";
import { ICommand } from "@src/interfaces/ICommand";
import { KristyCommandConfig } from "@src/interfaces/IKristyCommandConfig";
import Bot from "@src/Bot";
import { randomIntFromInterval } from "@src/utils/randomIntFromInterval";
import { createCanvas } from "@napi-rs/canvas";

export default class RandomCommand implements ICommand {
  public readonly discord: ChatInputApplicationCommandData = {
    name: "random",
    description: "Returns random number in range.",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "начало",
        description: "С какого числа начинать?",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
      {
        name: "конец",
        description: "На каком числе закончить?",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
    ],
  };
  public readonly kristy: KristyCommandConfig = {
    commandType: "global",
  };
  private bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  private drawRes(str: string) {
    const canvas = createCanvas(200, 200);
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
    ctx.fillRect(0, 0, 200, 200);

    ctx.font = "100px 'Rubik Mono One'";
    let text = ctx.measureText(str);
    ctx.font = `${90 - str.length * 10}px 'Rubik Mono One'`;
    text = ctx.measureText(str);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(
      str,
      100 - text.width / 2,
      100 + text.actualBoundingBoxAscent / 2,
    );

    return canvas.encode("png");
  }

  public async action(interaction: CommandInteraction) {
    const start =
      Number(
        interaction.options.data.find((el) => el.name === "начало")?.value,
      ) || 0;
    const final =
      Number(
        interaction.options.data.find((el) => el.name === "конец")?.value,
      ) || 100;
    const result = randomIntFromInterval(start, final).toString();

    const attachment = new AttachmentBuilder(await this.drawRes(result), {
      name: "image.png",
    });

    await interaction.reply({
      ephemeral: true,
      files: [attachment],
    });
  }
}
