import xml2js from "xml2js";
import { MessageEmbed } from "discord.js";
const parser = new xml2js.Parser();
import transmitDeveloperNotification from "./transmitDeveloperNotification";
import createEmbed from "./createEmbed";

async function parseYoutubeXML(xml: string | Buffer) {
  try {
    const result = await parser.parseStringPromise(xml);
    const feed = result["feed"];

    if (feed.entry.length > 0) {
      const entry = feed.entry[0];
      const author = entry.author[0].name[0];
      const authorURL = entry.author[0].uri[0];
      const title = entry.title[0];
      // const published = entry.published[0];
      const link = entry.link[0]["$"].href;
      // const updated = entry.updated[0];
      const embed = createEmbed(title, author, authorURL, link);

      return embed;
    }
  } catch (e) {
    transmitDeveloperNotification("Error: " + e.toString());
  }
}

export default parseYoutubeXML;
