const Parser = require('rss-parser');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
require('dotenv').config();

const parser = new Parser();
const token = process.env.TELEGRAM_BOT_KEY;
const bot = new TelegramBot(token, { polling: true });
const store = new Set();

cron.schedule('* * * * *', async () => {
    try {
        const feed = await parser.parseURL('https://www.jw-russia.org/rss.xml');
  
        feed.items.reverse().forEach(({ guid, title, link }, index) => {
            if (!store.has(guid)) {
                store.add(guid);

                setTimeout(() => bot.sendMessage('@mytestrsschannel', `${title}\n${link}`), index * 5000)
            }
        });
    } catch (error) {
        console.error(error);
    }
});