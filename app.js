const { set } = require('lodash');
const puppeteer = require('puppeteer');
const { Telegraf, Markup } = require('telegraf');
const WebSocket = require('ws');
const fs = require('fs');
const { async } = require('@firebase/util');


var arrayresult = [];
var entrada = "";
var red = 0;
var browser = null;
var url = null;


async function main() {
    // browser = await puppeteer.launch({headless: false });
    browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: false });

    

    const page = await browser.newPage();

    await page.goto('https://sambabet.com/');

    await page.click('.btn_general.login_btn');
    await page.type('.login_user.login_txt', 'armando312');
    await page.type('.login_pass.login_txt.password_eye_field', 'Arma312FJN');

    await Promise.all([
        page.waitForNavigation(),
        page.evaluate(() => {
            document.querySelector('form[method="POST"]').submit();
        }),
    ]);

    await page.goto('https://sambabet.com/casino/game/4975-football-studio');

    const cdp = await page.target().createCDPSession();
    await cdp.send('Network.enable');
    await cdp.send('Page.enable');




    function sendTelegram(array) {
        const unique = 3;
        if (array.length > unique) {
            array.shift();
        }



        console.log(array);
        red = 0;
        if (entrada != "") {
            outuput = "";
            if (array[array.length - 1] == "Tiger") {
                outuput = "AZUL";
            } else {
                outuput = "VERMELHO";
            }
            if (array[array.length - 1] == entrada) {
                const message = `\n✅ GREEN ✅
                \n🏃‍♂️ RESULTADO: ${outuput}
                \n➡️ <a href="https://sambabet.com/virtual/">Venha jogar com a gente!</a>`;
                telegram(message);
            } else {
                red = 1;
                const message = `\n❌ RED ❌
                \n🏃‍♂️ RESULTADO: ${outuput}
                \n➡️ <a href="https://sambabet.com/virtual/">Venha jogar com a gente!</a>`;
                telegram(message);
            }
            entrada = "";
        }

        if (array[unique - 1] != undefined
            && red == 0
            && array[unique - 1] == array[1]
            && array[unique - 1] == array[0]) {
            var input = "";
            if (array[unique - 1] == "Tiger") {
                input = "VERMELHO";
                entrada = "Dragon";
            } else {
                input = "AZUL";
                entrada = "Tiger";
            }
            const message = `\n✅ ENTRADA CONFIRMADA ✅
      \n🏃‍♂️ ENTRAR NO: ${input}
      \n➡️ <a href="https://sambabet.com/virtual/">Venha jogar com a gente!</a>`;
            telegram(message);
        }

    }
    function telegram(message) {
        const bot = new Telegraf("6565328483:AAGOUIwrwo3xiKrqKJsc40wGvDb6aWM67mc")
        bot.telegram.sendMessage("-1001832440382", message, { parse_mode: 'HTML' })
    }

    const connectWebSocket = function () {
        const ws = new WebSocket(url);
        ws.onmessage = (event) => {
            const obj = JSON.parse(event.data);
            if (obj.type === "dragontiger.resolved") {
                arrayresult.push(obj.args.result.winner);
                sendTelegram(arrayresult);
            }

        }
        setInterval(() => {
            ws.send(JSON.stringify({
                "id": "zu0nxeei0g",
                "type": "settings.update",
                "args": { "key": "generic.common.masterVolume", "data": 1 }
            }))
        }, 60000);
        browser.close()
    }



    const setSocket = response => {
        console.log("function setSocket");
        var urlParams = new URLSearchParams(response.url);
        if (urlParams.has("EVOSESSIONID")) {
            url = response.url
            setTimeout(() => {
                connectWebSocket()
            }, 5000);
        }

        setTimeout(function () {
            if (url == null || url == undefined) {
                browser.close();
                require('child_process').exec('node app.js', function (err, stdout, stderr) {
                    // console.log(stdout);
                });
            }
            console.log("reiniciando....");
            console.log(url);
        }, 10000);
    };

    const targets = await browser.targets();
    const nbTargets = targets.length;
    for (var i = 0; i < nbTargets; i++) {
        try {
            client = await targets[i].createCDPSession();
            await client.send("Target.setAutoAttach", {
                autoAttach: true,
                flatten: true,
                windowOpen: true,
                waitForDebuggerOnStart: false // is set to false in pptr
            })
            await client.send('Page.enable');
            await client.send('Network.enable');
            client.on('Network.webSocketCreated', setSocket)
        } catch (error) {

        }

    };
}


main();

setTimeout(function () {
    require('child_process').exec('node app.js', function (err, stdout, stderr) {
        // console.log(stdout);
    });
console.log("reiniciando...");
}, 600000);





