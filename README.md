# Class schedules telegram bot


[![Telegram bot](https://img.shields.io/badge/telegram-%40sspu__bot-blue.svg)](https://t.me/sspu_bot)
[![GitHub release](https://img.shields.io/github/release/Rundik/sspu-telegram-bot.svg)](https://GitHub.com/Rundik/sspu-telegram-bot/releases/)
[![Known Vulnerabilities](https://snyk.io/test/github/Rundik/sspu-telegram-bot/badge.svg)](https://snyk.io/test/github/Rundik/sspu-telegram-bot)
[![GitHub license](https://img.shields.io/github/license/Rundik/sspu-telegram-bot.svg)](https://github.com/Rundik/sspu-telegram-bot/blob/master/LICENSE)

A telegram bot that parses class schedules of [Shuya Branch of Ivanovo State University](http://sspu.ru) and sends them to users in a text form instead of PDF files (however, if there is a parsing error PDF file will be sent)

## Getting Started

You have to have node.js and npm installed

### Environment variables

Create an .env file with bot token and (optional) webhook settings

```
TG_TOKEN=# bot token goes here
CACHE_DIR=/tmp/cache

# If you don't want to use webhooks
BOT_TYPE=polling
# default polling settings
BOT_POLLING_INTERVAL=1000
BOT_POLLING_TIMEOUT=0
BOT_POLLING_LIMIT=100
BOT_POLLING_RETRYTIMEOUT=5000

# With webhooks
BOT_TYPE=webhook
BOT_URL=# url with https:// at the beginning
BOT_HOST=
BOT_PORT= 
```

### Installing and running

```bash
# For development
npm i
npm run dev

# For production
npm i --production
npm run start
```

## Logging

All request logs will be saved in ```db/loki.json```. You can read in json form or type ```npm run logs```. The output will be a table with last hundred records.

If you want to log each request to the console, set ```LOG_TO_CONSOLE``` environment variable

## Acknowledgments

Thanks [mullwar](https://github.com/mullwar) for an awesome telegram bot framework [telebot](https://github.com/mullwar/telebot)
