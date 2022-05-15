const Parser = require('rss-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const parser = new Parser();
const token = process.env.TELEGRAM_BOT_KEY;
const bot = new TelegramBot(token, { polling: false });

const isToday = (someDate) => {
    const today = new Date();

    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear();
}

(async () => {
    try {
        const feed = await parser.parseURL('https://www.jw-russia.org/rss.xml');
  
        feed.items.reverse().forEach(({ guid, title, link, isoDate }, index) => {
            const eventDate = new Date(isoDate);

            if (isToday(eventDate)) {
                setTimeout(() => bot.sendMessage('@mytestrsschannel', `${title}\n\n${eventDate.toLocaleDateString('ru-RU')}\n\n${link}`), index * 10000)
            }
        });
    } catch (error) {
        console.error(error);
    }
})();