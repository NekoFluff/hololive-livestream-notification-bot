import { liveStreamNotifier } from "./pubSubSubscriber";

// const url = "https://www.youtube.com/watch?v=Pkt9q0h_elM";
// const url = "https://www.youtube.com/watch?v=J-wP62z90Lk";
const url = "https://www.youtube.com/watch?v=Pkt9q0h_elM";

async function test() {
  // const data = await liveStreamNotifier.getURLData(url);
  // const timestamp = liveStreamNotifier.getStreamTimestamp(data);

  // if (timestamp) {
  //   console.log("This is a livestream " + timestamp);
  // } else {
  //   console.log("This is not a livestream");
  // }
  liveStreamNotifier.handleURL(
    "Mori Calliope Ch. hololive-EN",
    "https://www.youtube.com/watch?v=gVnhYEyr6m8"
  );
}

test();
