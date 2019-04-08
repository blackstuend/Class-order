const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage();
    var a = [1,2,3]
    var b = [4,5,6]
    await page.goto('https://github.com/blackstuend/Class-order');
    await page.evaluate(function(a,b){
        console.log(b)
        console.log(a)
    },a,b)
})()