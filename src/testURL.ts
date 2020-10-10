import discordBot from "./discord/discordBot";
import { liveStreamNotifier } from "./pubSubSubscriber";

// const url = "https://www.youtube.com/watch?v=J-wP62z90Lk";
const url = "https://www.youtube.com/watch?v=Fgm2OzADgog";

discordBot.on("ready", () => {
  liveStreamNotifier.handleURL("TEST AUTHOR", url);
});
