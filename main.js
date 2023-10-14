const puppeteer = require('puppeteer');
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');


var browser = null;
var timearrayinsert = 0;




async function main() {

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }


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

        // Obtém as dimensões da tela do dispositivo
        const { width, height } = await page.evaluate(() => ({
            width: window.screen.width,
            height: window.screen.height,
        }));

        // Define o tamanho da janela da página para as dimensões da tela do dispositivo
        await page.setViewport({ width, height });

        await page.goto('https://sambabet.com/');

        
        await delay(10000);

        await page.click('.btn_general.login_btn');
        await page.type('.login_user.login_txt', 'armando312');
        await page.type('.login_pass.login_txt.password_eye_field', 'Arma312FJN');

        await Promise.all([
            page.waitForNavigation(),
            page.evaluate(() => {
                document.querySelector('form[method="POST"]').submit();
            }),
        ]);

        await page.goto('https://sambabet.com/casino/game/43960-futebol-studio-ao-vivo');

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
                    outuput = "AMARELO";
                }
                if (array[array.length - 1] == entrada) {
                    const message = `\n✅ GREEN ✅
               \n🏃‍♂️ RESULTADO: ${outuput}
               \n➡️ <a href="https://affstream.click/KTHhsv43">Venha jogar com a gente!</a>`;
                    telegram(message);
                } else {
                    red = 1;
                    const message = `\n❌ RED ❌
                    \n🏃‍♂️ RESULTADO: ${outuput}
                    \n➡️ <a href="https://affstream.click/KTHhsv43">Venha jogar com a gente!</a>`;

                }
                entrada = "";
            }

            if (array[unique - 1] != undefined
                && red == 0
                && array[unique - 1] == array[1]
                && array[unique - 1] == array[0]) {
                var input = "";
                if (array[unique - 1] == "Tiger") {
                    input = "AMARELO";
                    entrada = "Dragon";
                } else {
                    input = "AZUL";
                    entrada = "Tiger";
                }
                const message = `\n✅ ENTRADA CONFIRMADA ✅
                \n🏃‍♂️ ENTRAR NO: ${input}
                \n➡️ <a href="https://affstream.click/KTHhsv43">Venha jogar com a gente!</a>`;
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
                    const dataAtual = new Date();
                    timearrayinsert = dataAtual.toLocaleTimeString()
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



function calcularDiferencaHoras(hora1, hora2) {
    const [h1, m1, s1] = hora1.split(':').map(Number);
    const [h2, m2, s2] = hora2.split(':').map(Number);
    const diferencaEmSegundos = Math.abs((h1 * 3600 + m1 * 60 + s1) - (h2 * 3600 + m2 * 60 + s2));
    const diferencaHoras = String(Math.floor(diferencaEmSegundos / 3600)).padStart(2, '0');
    const diferencaMinutos = String(Math.floor((diferencaEmSegundos % 3600) / 60)).padStart(2, '0');
    const diferencaSegundos = String(diferencaEmSegundos % 60).padStart(2, '0');
    return `${diferencaHoras}:${diferencaMinutos}:${diferencaSegundos}`;
}

setInterval(async function () {
    if (timearrayinsert != 0) {
        timearrayinsert2 = new Date().toLocaleTimeString();
        const hora1 = timearrayinsert;
        const hora2 = timearrayinsert2;
        const diferenca = calcularDiferencaHoras(hora1, hora2);
        console.log(diferenca);
        if (diferenca > "00:00:57") {
            timearrayinsert = 0;
            await browser.close();
            main();
        }
    }
}, 1000);

main();
setInterval(async function () {
    await browser.close();
    main();
}, 1200000);
// }, 300000);


function sendBoasVindas() {
    const buttons = {
        inline_keyboard: [
            [{ text: "💰 Entre - Sinal da Sorte! 💰", url: "https://affstream.click/KTHhsv43" }]
        ]
    }
    const message = `✅ Sinais 24 horas por dia\n✅ Usamos Martingale\n\nOpere com segurança\n\n🤑 Comece a operar e faturar agora mesmo!\n🤑 Ganhe um bônus de 150% ate 1000 usando o código VEMSAMBAR150👇👇`;

    const bot = new Telegraf("6565328483:AAGOUIwrwo3xiKrqKJsc40wGvDb6aWM67mc");

    setInterval(() => {
        bot.telegram.sendMessage("-1001807619335", message, {
            parse_mode: 'HTML',
            reply_markup: buttons
        });
    }, 3600000);
}

sendBoasVindas();

