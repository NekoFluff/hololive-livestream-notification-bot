import axios from "axios";
import cron, { ScheduledTask } from "node-cron";
import LivestreamsRepository, { Livestream } from "./repos/LivestreamsRepository";
import moment from "moment-timezone";
import { DiscordMessenger } from "discord-messenger";
import { getSubscribers } from "./pubSubSubscriber";

const messenger = DiscordMessenger.getMessenger();

type LiveStreamData = {
  streamTimestamp: number;
  liveCronJob?: ScheduledTask;
  reminderCronJob?: ScheduledTask; // Reminder 15 minutes prior to stream
};

class LiveStreamNotifier {
  scheduledLivestreams: { [key: string]: LiveStreamData } = {};
  urlData: { [key: string]: string } = {};
  livestreamsRepo: LivestreamsRepository;

  constructor() {
    this.livestreamsRepo = new LivestreamsRepository();
  }

  async getScheduleFromMongoDB() {
    // Get data from mongodb
    const livestreams = await this.livestreamsRepo.getLivestreams();
    for (const livestream of Object.values(livestreams))
      this.handleURL(livestream.author, livestream.url);
  }

  async handleURL(author: string, url: string) {
    try {
      const livestreamData = await this.isLivestream(url);

      // Not livestreaming
      if (!livestreamData) {
        console.log(`${author} is not livestreaming at ${url}`);
        messenger.transmitDeveloperNotification(
          `${author} is not livestreaming at ${url}`
        );
        return false;
      } else {
        messenger.transmitDeveloperNotification(`${author} IS livestreaming at ${url}`);
      }

      // Livestream schedule already exists
      if (this.scheduledLivestreams[url]) {
        const readableDate = this.convertUnixTimestampToReadableDate(this.scheduledLivestreams[url].streamTimestamp);

        messenger.transmitDeveloperNotification(
          `Livestream already exists at UNIX time ${this.scheduledLivestreams[url].streamTimestamp} [${readableDate}]`
        );
        if (
          this.scheduledLivestreams[url].streamTimestamp ===
          livestreamData.streamTimestamp
        ) {
          messenger.transmitDeveloperNotification(
            `Livestream date (${livestreamData.streamTimestamp}) didn't change. Doing nothing.`
          );

          return false;
        } else {
          // Unschedule old one. Reschedule with new date
          this.cancelScheduledLivestream(url);
          messenger.transmitDeveloperNotification("Canceling existing livestream.");
        }
      }

      // Schedule 15 min reminder
      livestreamData.reminderCronJob = this.scheduleLivestream(
        livestreamData.streamTimestamp - 60 * 15,
        async () => {
          messenger.transmitDiscordNotification(
            author,
            `[${author}] Livestream starting in 15 minutes! ${url}`,
            {
              cooldownKey: "disabled",
              users: await getSubscribers(author)
            }
          );
        }
      );

      // Schedule on-time reminder
      livestreamData.liveCronJob = this.scheduleLivestream(
        livestreamData.streamTimestamp,
        async () => {
          messenger.transmitDiscordNotification(
            author,
            `[${author}] Livestream starting! ${url}`,
            {
              cooldownKey: "disabled",
              channel: "hololive-stream-started",
              users: await getSubscribers(author)
            }
          );
          delete this.scheduledLivestreams[url];
        }
      );

      const livestream: Livestream = {
        _id: url,
        author,
        url,
        date: new Date(livestreamData.streamTimestamp * 1000)
      }

      // Also add data to backend
      this.livestreamsRepo.addLivestreams([livestream]);

      // Store livestream data
      this.scheduledLivestreams[url] = livestreamData;

      // Remove cached data
      this.removeURLData(url);

      // Finally notify the develoepr the scheduling task has been completed
      const formattedTime = this.convertUnixTimestampToReadableDate(
        livestreamData.streamTimestamp
      );

      messenger.transmitDeveloperNotification(`Success! Livestream timestamp: [${formattedTime}]`);

      // Successfully scheduled a livestream
      return true;
    } catch (e) {
      const errorMsg = `Error occured while handling url ${url}.\nAuthor: ${author}\nError: ${e}`;
      messenger.transmitDeveloperNotification(errorMsg);
      console.log(errorMsg);
    }

    // Did not successfully schedule a livestream
    return false;
  }

  isLivestreamScheduled(url: string) {
    return this.scheduledLivestreams[url] != null;
  }

  cancelScheduledLivestream(url: string) {
    this.scheduledLivestreams[url].liveCronJob?.destroy();
    this.scheduledLivestreams[url].reminderCronJob?.destroy();
    delete this.scheduledLivestreams[url];
  }

  scheduleLivestream(unixTimestamp: number, fn: Function) {
    // Parse timestamp
    const cronTimestamp = this.convertUnixTimestamp(unixTimestamp);

    // ┌────────────── second (optional)
    // │ ┌──────────── minute
    // │ │ ┌────────── hour
    // │ │ │ ┌──────── day of month
    // │ │ │ │ ┌────── month
    // │ │ │ │ │ ┌──── day of week
    // │ │ │ │ │ │
    // │ │ │ │ │ │
    // * * * * * *
    // The last five are the ones that matter

    var task = cron.schedule(
      cronTimestamp,
      () => {
        fn();
        onTaskEnd();
      },
      {
        scheduled: false,
      }
    );

    var onTaskEnd = () => {
      task.destroy();
    };

    task.start();

    return task;
  }

  async getURLData(url: string) {
    try {
      if (!this.urlData[url]) this.urlData[url] = (await axios.get(url)).data;
    } catch (e) {
      messenger.transmitDeveloperNotification(`Axios error encountered:\n${e}`);
    }
    return this.urlData[url];
  }

  removeURLData(url: string) {
    delete this.urlData[url];
  }

  async isLivestream(url: string) {
    try {
      const data = await this.getURLData(url);
      const timestamp = this.getStreamTimestamp(data);

      if (timestamp) {
        const livestream: LiveStreamData = {
          streamTimestamp: timestamp,
        };
        return livestream;
      }
    } catch (e) {
      messenger.transmitDeveloperNotification(`Cannot determine if livestream:\n${e}`);
    }

    return null;
  }

  getStreamTimestamp(text: string) {
    let re = new RegExp(/(?<="scheduledStartTime":")\d+/); // constructor with regular expression literal as first argument (Starting with ECMAScript 6)

    const res = text.match(re);
    if (res && res.length > 0) return parseInt(res[0]);
    return null;
  }

  convertUnixTimestampToReadableDate(unixTimestamp: number) {
    const date = moment(unixTimestamp * 1000);
    const formattedTime = date
      .tz("America/Los_Angeles")
      .format("MMMM Do YYYY, h:mm:ss a z"); // 5am PDT
    return formattedTime;
  }

  convertUnixTimestamp(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);

    const result = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1
      } *`;

    return result;
  }
}

export default LiveStreamNotifier;

// async function test() {
//   const notifier = new LiveStreamNotifier();
//   const result = await notifier.handleURL(
//     "Okayu Nekomata",
//     "https://www.youtube.com/watch?v=_8-mjDlCnZQ"
//   );
//   await notifier.handleURL(
//     "Okayu Nekomata",
//     "https://www.youtube.com/watch?v=_8-mjDlCnZQ"
//   );
//   await notifier.handleURL(
//     "Okayu Nekomata",
//     "https://www.youtube.com/watch?v=_8-mjDlCnZQ"
//   );
//   console.log("Handled URL");

//   // let result = await axios.get("https://www.youtube.com/watch?v=MgpRWzSJj1M");
//   // fs.writeFile("temp/axios-output.html", result.data, function (err) {
//   // if (err) return console.log(err);
//   //   console.log("Successfully wrote to file");
//   // });

//   // result = await axios.get("https://www.youtube.com/watch?v=fqqyT966-GY");
//   // fs.writeFile("temp/axios-output2.html", result.data, function (err) {
//   //   if (err) return console.log(err);
//   //   console.log("Successfully wrote to file");
//   // });
// }

// test();
