import axios from "axios";
import cron, { ScheduledTask } from "node-cron";
import transmitDiscordNotification from "./discord/transmitDiscordNotification";

type LiveStreamData = {
  streamTimestamp: number;
  cronJob?: ScheduledTask;
  reminderCronJob?: ScheduledTask; // Reminder 15 minutes prior to stream
};

class LiveStreamNotifier {
  scheduledLivestreams: { [key: string]: LiveStreamData } = {};
  urlData: { [key: string]: string } = {};

  constructor() {}

  async handleURL(author: string, url: string) {
    const livestreamData = await this.isLivestream(url);

    // Not livestreaming
    if (!livestreamData) {
      console.log("Not livestreaming!");
      return;
    }

    // Livestream schedule already exists
    if (this.scheduledLivestreams[url])
      if (
        this.scheduledLivestreams[url].streamTimestamp ===
        livestreamData.streamTimestamp
      )
        return;
      else {
        // Unschedule
        this.scheduledLivestreams[url].cronJob?.destroy();
        delete this.scheduledLivestreams[url];
      }

    // Parse timestamp
    const reminderCronTimestamp = this.convertUnixTimestamp(
      livestreamData.streamTimestamp - 60 * 15
    );
    const cronTimestamp = this.convertUnixTimestamp(
      livestreamData.streamTimestamp
    );

    // Schedule using cron
    console.log("Parsed Cron Timestamp", cronTimestamp);
    // const test = Math.round(new Date().getTime() / 1000) + 60;
    // const test2 = Math.round(new Date().getTime() / 1000) + 120;
    // const testUNIX = this.convertUnixTimestamp(test);
    // const test2UNIX = this.convertUnixTimestamp(test2);
    livestreamData.reminderCronJob = this.scheduleLivestream(
      reminderCronTimestamp,
      () => {
        console.log(
          "Running 15 min livestream reminder! " + reminderCronTimestamp
        );

        transmitDiscordNotification(
          author,
          `[${author}] Livestream starting in 15 minutes! ${url}`
        );
      }
    );

    livestreamData.cronJob = this.scheduleLivestream(cronTimestamp, () => {
      console.log("Running livestream reminder! " + reminderCronTimestamp);

      transmitDiscordNotification(
        author,
        `[${author}] Livestream starting! ${url}`
      );
      delete this.scheduledLivestreams[url];
    });

    // Store livestream data
    this.scheduledLivestreams[url] = livestreamData;

    // Remove cached data
    this.removeURLData(url);
  }

  scheduleLivestream(cronTimestamp: string, fn: Function) {
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
    if (!this.urlData[url]) this.urlData[url] = (await axios.get(url)).data;
    return this.urlData[url];
  }

  removeURLData(url: string) {
    delete this.urlData[url];
  }

  async isLivestream(url: string) {
    const data = await this.getURLData(url);
    const timestamp = this.getStreamTimestamp(data);

    if (timestamp) {
      const livestream: LiveStreamData = {
        streamTimestamp: timestamp,
      };
      return livestream;
    } else return null;
  }

  getStreamTimestamp(text: string) {
    let re = new RegExp(/(?<="scheduledStartTime":")\d+/); // constructor with regular expression literal as first argument (Starting with ECMAScript 6)

    const res = text.match(re);
    if (res && res.length > 0) return parseInt(res[0]);
    return null;
  }

  convertUnixTimestamp(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);

    const result = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
      date.getMonth() + 1
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
