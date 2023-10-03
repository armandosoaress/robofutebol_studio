const puppeteer = require('puppeteer');
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');


var browser = null;

async function main() {
    try {
        var arrayresult = [];
        var entrada = "";
        var red = 0;

        browser = await puppeteer.launch({
            // "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: false
        });

        const pages = await browser.pages();

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
            bot.telegram.sendMessage("-1001807619335", message, { parse_mode: 'HTML' })
        }

        const getSocket = response => {
            var texto = JSON.stringify(response.response.payloadData);
            if (texto.includes("result")) {
                var obj = JSON.parse(response.response.payloadData);
                try {
                    arrayresult.push(obj.args.result.winner);
                    sendTelegram(arrayresult);
                } catch (error) {
                    // console.log(error);
                }
            }
        };

        cdp.on('Network.webSocketFrameReceived', getSocket);

        const targets = await browser.targets();
        const nbTargets = targets.length;
        for (var i = 0; i < nbTargets; i++) {
            if (targets[i].url().includes("belloatech.evo-games.com")) {
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
                    client.on('Network.webSocketFrameReceived', getSocket)
                } catch (error) {

                }

            }
        };
    } catch (error) {
        console.log(error);
    }
}

main();
setInterval(async function () {
    await browser.close();
    main();
}, 300000);