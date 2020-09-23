import discordBot from "../discord/discordBot";

function transmitDeveloperNotification(message: string) {
  // console.log(discordBot.users);
  const user = discordBot.users.cache.get("142090800279453696");
  if (user) user.send(message);
}

export default transmitDeveloperNotification;
