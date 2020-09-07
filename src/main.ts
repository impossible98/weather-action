import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as procress from 'process';

const BASE_DIR = path.resolve(__dirname);
const DIST_DIR = path.join(BASE_DIR, '..', 'dist');
// 9ae102ed512aa24b80dc1b650baef463

const options = {
    hostname: 'api.openweathermap.org',
    method: 'GET',
    path: `/data/2.5/onecall?lat=31.22&lon=121.46&exclude=hourly,minutely&appid=${procress.argv[2]}&lang=zh_cn`,
};

const req = https.request(options, function (res) {
    let chunks: any = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.once('end', function () {
        let result: string = Buffer.concat(chunks).toString();
        let max = JSON.parse(result)['daily'][0]['temp']['max'];
        max = (Number(max) - 273.15).toFixed(2);

        let min = JSON.parse(result)['daily'][0]['temp']['min'];
        min = (Number(min) - 273.15).toFixed(2);

        const description = JSON.parse(result)['daily'][0]['weather'][0]['description'];
        let sunrise = JSON.parse(result)['daily'][0]['sunrise'];
        sunrise = new Date(sunrise * 1000);
        const sunriseHour = sunrise.getUTCHours() - 16;
        const sunriseMinute = sunrise.getUTCMinutes();
        const sunriseSecond = sunrise.getUTCSeconds();

        let sunset = JSON.parse(result)['daily'][0]['sunset'];
        sunset = new Date(sunset * 1000);
        const sunsetHour = sunset.getUTCHours() + 8;
        const sunsetMinute = sunset.getUTCMinutes();
        const sunsetSecond = sunset.getUTCSeconds();


        fs.access(DIST_DIR, fs.constants.F_OK, function (error) {
            fs.mkdir(DIST_DIR, function (error) { });

            const data = `天气情况：${description}
最高气温：${max}
最低气温：${min}
日出时间：${sunriseHour}:${sunriseMinute}:${sunriseSecond}
日落时间：${sunsetHour}:${sunsetMinute}:${sunsetSecond}
`;
            console.log(data);

            fs.writeFile('dist/result.txt', data, function (error) { });
        });
    });
});

req.end();




