import { MessageEmbed } from "discord.js";
function createEmbed(
  title: string,
  author: string,
  authorURL: string,
  link: string
) {
  return (
    new MessageEmbed()
      .setTitle(title)
      .setAuthor(author, undefined, authorURL)
      .setURL(link)
      // .setDescription(`Published ${published}`)
      .setColor(0x5eddee)
  );
}

export default createEmbed;
