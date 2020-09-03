import json
import os
import time
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, '..', 'dist')

url = 'https://api.openweathermap.org/data/2.5/onecall?lat=31.22&lon=121.46&exclude=hourly,minutely&appid=9ae102ed512aa24b80dc1b650baef463&lang=zh_cn'
response = urllib.request.urlopen(url).read().decode('utf-8')

result = json.loads(response)

temp = result.get('daily')[0].get('temp')
if temp:
    max = temp.get('max')
    min = temp.get('min')

weather = result.get('daily')[0].get('weather')
if weather:
    description = weather[0].get('description')

sunrise = result.get('daily')[0].get('sunrise')

sunset = result.get('daily')[0].get('sunset')

if not os.path.exists(DIST_DIR):
    os.makedirs(DIST_DIR)
with open('dist/result.txt', 'w', encoding='utf-8') as f:
    f.write('''天气情况：{0}
最高气温：{1:.2f}
最低气温：{2:.2f}
日出时间：{3}:{4[4]}:{4[5]}
日落时间：{5}:{6[4]}:{6[5]}
'''.format(description, max - 273.15, min - 273.15, time.gmtime(sunrise)[3] - 16, time.gmtime(sunrise), time.gmtime(sunset)[3] + 8, time.gmtime(sunset)))
