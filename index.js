require("dotenv").config();
const app = require("./server");
// const discordBot = require("./discordBot");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const pubSubSubscriber = require("./pubSubSubscriber");

function subscribe() {
  var topics = [
    "https://www.youtube.com/channel/UCyl1z3jo3XHR1riLFKG5UAg", // Watson
    "https://www.youtube.com/channel/UCMwGHR0BTZuLsmjY_NT5Pwg", // Ninomae
    "https://www.youtube.com/channel/UCL_qhgtOy0dy1Agp8vkySQg", // Mori
    "https://www.youtube.com/channel/UCHsx4Hqa-1ORjQTh9TYDhww", // Takanashi
    "https://www.youtube.com/channel/UCoSrY_IQQVpmIRZ9Xf-y93g", // Gawr Gura
  ];
  var hub = "http://pubsubhubbub.appspot.com/";
  for (topic of topics) {
    pubSubSubscriber.subscribe(topic, hub, function (err) {
      if (err) {
        console.log("Failed subscribing", err);
      }
    });
  }
}
// subscribe();

// let reschedulerId = setInterval(() => {
//   subscribe();
// }, 400000 * 1000);
