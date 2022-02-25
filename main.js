process.env.NTBA_FIX_319 = 1;

const schedule = require('node-schedule');
const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token, {polling: true});

bot.on("polling_error", console.log);

bot.on('message', (msg) => {
    if (msg.chat.type == 'private'){
        if (msg.text.split(" ")[0] == "/start"){
            bot.sendMessage(msg.chat.id, "提醒群友快點睡覺！(只支援在群組內使用)\nGitHub: https://github.com/ArsFy/gotosleepbot");
        }
    }else{
        let msgInfo = msg.text.split(" ");
        // console.log(msg)
        switch (msgInfo[0]){
            case "/start":
            case "/start"+config.bot:
                bot.sendMessage(msg.chat.id, "提醒群友快點睡覺！\nGitHub: https://github.com/ArsFy/gotosleepbot");
                break;
            case "/help":
            case "/help"+config.bot:
                bot.sendMessage(msg.chat.id, "使用幫助!\n關於Bot: /start\n幫群友設定睡眠提醒：/addsleep @username hour:minute", {"reply_to_message_id": msg.message_id});
                break;
            case "/addsleep":
            case "/addsleep"+config.bot:
                if (msgInfo[1] == undefined || msgInfo[2] == undefined){
                    bot.sendMessage(msg.chat.id, "缺少參數：/addsleep @username hour:minute", {"reply_to_message_id": msg.message_id});
                }else{
                    let date = msgInfo[2].split(":");
                    let hour = Number(date[0]);
                    let minute = Number(date[1]);
                    if (!isNaN(hour) && !isNaN(minute)){
                        let nowTime = new Date();
                        let setDate, tday;
                        if (hour <= nowTime.getHours()){
                            if (minute <= nowTime.getMinutes()){
                                setDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), new Date(nowTime.getTime()+24*60*60*1000).getDate(), Number(date[0]), Number(date[1]), 0);
                                tday = "明天";
                            }else{
                                setDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), Number(date[0]), Number(date[1]), 0);
                                tday = "今天";
                            }
                        }else{
                            setDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), Number(date[0]), Number(date[1]), 0);
                            tday = "今天";
                        }
                        (async (username, chatid)=>{
                            schedule.scheduleJob(setDate, ()=>{
                                bot.sendMessage(chatid, `${username} 睡覺時間到了！`);
                            });
                        })(msgInfo[1], msg.chat.id)
                        bot.sendMessage(msg.chat.id, `設定提醒：${tday} ${hour}:${minute}，我會${msg.chat.username!=undefined?"在 @"+msg.chat.username+" ":""}催 ${msgInfo[1]} 睡覺哦！`, {"reply_to_message_id": msg.message_id});
                    }else{
                        bot.sendMessage(msg.chat.id, "格式錯誤：/addsleep @username hour:minute", {"reply_to_message_id": msg.message_id});
                    }
                }
                break;
        }
    }
});

console.log("Start Bot...");