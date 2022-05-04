const d3 = require('d3-ease');

const pricesArr: number[] = [];
const volumeArr: number[] = [];

// easeCubic price values 
for (let i = 1; i < 2; i += 0.01) {
    let easeCubic = Math.trunc((d3.easeCubic(i) * 20) * 100) / 100
    pricesArr.push(easeCubic);
}

// easeQuadIn volume values 
for (let i = 1; i < 2; i += 0.01) {
    let easeQuadIn = Math.round(d3.easeQuadIn(i) * 500);
    volumeArr.push(easeQuadIn);
}

/**
 *  Returns random number between a specified range
 * 
 * @param min 
 * @param max 
 * @returns random number between a specified range i.e. (10, 20)
 */
function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns [daily] tick data in the following format i.e. { timestamp: '{2020-02-02 09:30:9.252', price: 21.75, volume: 1110 }, every second, min, and hour during NYSE market hours | 09:30am - 4:00pm EST
 * Price utilizes d3-ease (easeCubic) for cubic easing. 
 * Volume utilizes d3-ease (easqQuadIn) for quadratic easing. 
 * Run npx ts-node trade_data.ts to see terminal output
 */
function buildTimeStamp() {
    const year = 2020;
    const month = 2;
    const day = 2;

    let price;
    let volume;

    let hours = 9;
    let mins = 30;
    let seconds = 0;

    let tickTime = 0;

    let testDataObj: { timestamp: string, price: number, volume: number }[] = [];

    // Market Hours: 09:30 to 1600 
    while (tickTime < 6430) {

        let timestamp = `{${year}-0${month}-0${day} ${hours}:0${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
        price = pricesArr[randomIntFromInterval(0, 30)];
        volume = volumeArr[randomIntFromInterval(0, 50)]

        // Reset {seconds} and increase {mins} i.e. 09:00:59 --> 09:01:00
        if (seconds >= 60) {
            seconds = 0;
            mins++;
            timestamp = `{${year}-0${month}-0${day} ${hours}:0${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
            price = pricesArr[randomIntFromInterval(0, 30)];
            volume = volumeArr[randomIntFromInterval(0, 50)]
        }

        // Remove leading "0" before {mins} when {mins} hits double digits i.e. 09:09:57 --> 09:10:00
        if (mins >= 10) {
            timestamp = `{${year}-0${month}-0${day} ${hours}:${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
            price = pricesArr[randomIntFromInterval(0, 30)];
            volume = volumeArr[randomIntFromInterval(0, 50)]
        }

        // Remove leading "0" before {mins} when {mins} hits double digits and reset {seconds} at "1 min" mark i.e. 09:10:59 --> 09:11:4
        if (mins >= 10 && seconds >= 60) {
            seconds = 0;
            mins++;
            timestamp = `{${year}-0${month}-0${day} ${hours}:${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
            price = pricesArr[randomIntFromInterval(0, 30)];
            volume = volumeArr[randomIntFromInterval(0, 50)]
        }

        // If {mins} hits "1 hour" mark, add leading zero in front of {mins}, reset {hours} i.e. 09:59:59 --> 10:00:00
        if (mins >= 60) {
            hours++;
            mins = 0;
            timestamp = `{${year}-0${month}-0${day} ${hours}:0${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
            price = pricesArr[randomIntFromInterval(0, 30)];
            volume = volumeArr[randomIntFromInterval(0, 50)]
        }

        // If the time is before 10AM append "0" before digit i.e. 09
        if (hours < 10) {
            timestamp = `{${year}-0${month}-0${day} 0${hours}:${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
        }

        // If the time is before 10AM and {seconds} need to be reset
        if (hours < 10 && seconds >= 60) {
            seconds = 0;
            mins++;
            timestamp = `{${year}-0${month}-0${day} 0${hours}:${mins}:${seconds += randomIntFromInterval(1, 3)}.${randomIntFromInterval(0.90, 999)}`;
        }
        testDataObj.push({
            "timestamp": timestamp,
            "price": price,
            "volume": volume
        });
        tickTime++;
    }
    // Values will be truncated in terminal output (by design)
    console.dir(testDataObj, { 'maxArrayLength': null });
}
buildTimeStamp();
