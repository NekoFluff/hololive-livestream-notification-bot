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

DATABASE_URI=mongodb database uri

DATABASE_NAMESPACE=database name

DEVELOPER_MODE=off # Skip notifications to non-developer servers when developer mode is on

### Install packages and run

`npm install`

`npm start`

### Questions ?

Discord: <b>Kitsune#1040</b>

Twitter: <b>@SheavinNou</b>
