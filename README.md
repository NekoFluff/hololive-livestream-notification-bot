# Hololive Livestream Notification Bot

Sends notifications when livestreams from hololive are about to begin. (15 minutes prior and on time)

Requires a server text room with the name `hololive-notifications`

Bot link: <a>https://discord.com/oauth2/authorize?client_id=757705458411897046&permissions=2048&scope=bot</a>

## Using the project?

### Make a .env file
PORT=port#

PREFIX=command prefix

TOKEN=discord bot token

PUBSUBHUBBUB_CALLBACK=callback url to the server (e.g. https://website.com/pubsubhubbub)

MONGO_CONNECTION_URL=connection url to a mongodb instance

DEVELOPER_MODE=off # Skip notifications to non-developer servers when developer mode is on

### Set up MongoDB Database and Collections

You can get a free cluster from MongoDB Atlas. 
You can use MongoDB Compass to interface with the cluster.
You will need to create a hololive-en database. Contained inside are three collections `feeds`, `scheduledLivestreams`, `subscriptions`. You will need to create all three.
The only documents you will need to manually generate is in the `feeds` collection. Each document should describe the vtuber being tracked.

Example:
```
{
    "firstName": "gawr",
    "lastName": "gura",
    "topicURL": "https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCoSrY_IQQVpmIRZ9Xf-y93g",
    "group": "en",
    "generation": 1
}
```

### Install packages and run

`npm install`

`npm start`

### Questions ?

Discord: <b>きつね#1040</b>

Twitter: <b>@SheavinNou</b>
