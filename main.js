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
        let msgInfo = msg.text!=undefined?msg.text.split(" "):"";
        // console.log(msg)
        switch (msgInfo[0]){
            case "/start":
            case "/start"+config.bot:
                bot.sendMessage(msg.chat.id, "提醒群友快點睡覺！\nGitHub: https://github.com/ArsFy/gotosleepbot");
                break;
            case "/help":
            case "/help"+config.bot:
                bot.sendMessage(msg.chat.id, "使用幫助!\n關於Bot: /start\n幫群友設定睡眠提醒：/addsleep @username hour:minute\n給自己設定睡眠提醒：/addforme hour:minute\n其他事件提醒：/addtodo @username hour:minute 要做的事", {"reply_to_message_id": msg.message_id});
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
                        (async (username, chatid, from)=>{
                            schedule.scheduleJob(setDate, ()=>{
                                bot.sendMessage(chatid, `${username}, @${from} 提醒你睡覺了！`, {reply_markup: {"inline_keyboard": [[{"text":"我要再摸10分鐘","callback_data": JSON.stringify({"event":"sleep", "user": username})}]]}});
                            });
                        })(msgInfo[1], msg.chat.id, msg.from.username)
                        bot.sendMessage(msg.chat.id, `設定提醒：${tday} ${hour<10?"0"+hour:hour}:${minute<10?"0"+minute:minute}，我會${msg.chat.username!=undefined?"在 @"+msg.chat.username+" ":""}提醒 ${msgInfo[1]} 睡覺哦！`, {"reply_to_message_id": msg.message_id});
                    }else{
                        bot.sendMessage(msg.chat.id, "格式錯誤：/addsleep @username hour:minute", {"reply_to_message_id": msg.message_id});
                    }
                }
                break;
            case "/addforme":
            case "/addforme"+config.bot:
                if (msgInfo[1] == undefined){
                    bot.sendMessage(msg.chat.id, "缺少參數：/addforme hour:minute", {"reply_to_message_id": msg.message_id});
                }else{
                    let date = msgInfo[1].split(":");
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
                                bot.sendMessage(chatid, `@${username} 睡覺時間到了!`, {reply_markup: {"inline_keyboard": [[{"text":"我要再摸10分鐘","callback_data": JSON.stringify({"event":"sleep", "user": "@"+username})}]]}});
                            });
                        })(msg.from.username, msg.chat.id)
                        bot.sendMessage(msg.chat.id, `設定提醒：${tday} ${hour<10?"0"+hour:hour}:${minute<10?"0"+minute:minute}，我會${msg.chat.username!=undefined?"在 @"+msg.chat.username+" ":""}提醒你睡覺哦！`, {"reply_to_message_id": msg.message_id});
                    }else{
                        bot.sendMessage(msg.chat.id, "格式錯誤：/addforme hour:minute", {"reply_to_message_id": msg.message_id});
                    }
                }
                break;
            case "/addtodo":
            case "/addtodo"+config.bot:
                if (msgInfo[1] == undefined || msgInfo[2] == undefined || msgInfo[3] == undefined){
                    bot.sendMessage(msg.chat.id, "缺少參數：/addtodo @username hour:minute 要做的事", {"reply_to_message_id": msg.message_id});
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
                        (async (username, chatid, todo, from)=>{
                            schedule.scheduleJob(setDate, ()=>{
                                bot.sendMessage(chatid, `${username}, @${from} 提醒你 ${todo} 了！`);
                            });
                        })(msgInfo[1], msg.chat.id, msgInfo[3], msg.from.username)
                        bot.sendMessage(msg.chat.id, `設定提醒：${tday} ${hour<10?"0"+hour:hour}:${minute<10?"0"+minute:minute}，我會${msg.chat.username!=undefined?"在 @"+msg.chat.username+" ":""}提醒 ${msgInfo[1]} ${msgInfo[3]}哦！`, {"reply_to_message_id": msg.message_id});
                    }else{
                        bot.sendMessage(msg.chat.id, "格式錯誤：/addtodo @username hour:minute 要做的事", {"reply_to_message_id": msg.message_id});
                    }
                }
                break;
        }
    }
});

bot.on('callback_query', (event_info)=>{
    let msgJson = JSON.parse(event_info.data);
    switch (msgJson['event']){
        case "sleep":
            if (msgJson['user'] == "@"+event_info.from.username){
                bot.answerCallbackQuery(event_info.id, {"text": "十分鐘後提醒你！"});
                bot.deleteMessage(event_info.message.chat.id, event_info.message.message_id);
                let setDate = new Date(new Date().getTime()+1000*60*10);
                (async (username, chatid)=>{
                    schedule.scheduleJob(setDate, ()=>{
                        bot.sendMessage(chatid, `${username} 睡覺時間到了!`, {reply_markup: {"inline_keyboard": [[{"text":"我要再摸10分鐘","callback_data": JSON.stringify({"event":"sleep", "user": "@"+username})}]]}});
                    });
                })(msgJson['user'], event_info.message.chat.id)
            }else{
                bot.answerCallbackQuery(event_info.id, {"text": "這個不是你的提醒哦！"});
            }
            break;
    }
})

console.log("Start Bot...");