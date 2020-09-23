import commands, { Command } from "./index";
import { MessageEmbed } from "discord.js";

const HelpCommand: Command = {
  name: "help",
  description: "Display all available commands!\n`!help`",
  async execute(msg, args) {
    console.log("Commands: ");

    const embed = new MessageEmbed().setColor("#0099ff").setTitle("Commands");
    // .setURL('https://discord.js.org/')
    // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    // .setDescription("I hope you find this useful");
    // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    // .addFields(
    //   { name: 'Regular field title', value: 'Some value here' },
    //   { name: '\u200B', value: '\u200B' },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    // )
    // .addField('Inline field title', 'Some value here', true)
    // .setImage('https://i.imgur.com/wSTFkRM.png')
    // .setTimestamp()
    // .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    Object.keys(commands).map((key: string) => {
      embed.addField(
        process.env.PREFIX + commands[key].name,
        commands[key].description,
        false
      );
    });

    msg.channel.send(embed);
  },
};

export default HelpCommand;
