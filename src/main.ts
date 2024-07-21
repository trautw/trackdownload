import fetch from 'node-fetch';
import fs from 'fs';

import * as crypto from 'crypto';
export const md5 = (contents: string) => crypto.createHash('md5').update(contents).digest("hex");

console.log("Hello world!");

function dumpTrack(year: number,month: number,day: number) {

const from = new Date(year, month, day, 0, 0);
const to = new Date(year, month, day, 23, 59, 59);

const pageSize = 1500;

// const cmd = "Proc_GetTrackN'9172994993',N'1721340000',N'1721426399',N'100000'20018";
const cmd = "Proc_GetTrackN'9172994993',N'"+from.valueOf()/1000+"',N'"+to.valueOf()/1000+"',N'100000'"+pageSize+"18";

const strAppID = process.env.AppID;
const strUser  = process.env.User;
const nTimeStamp = "1721405001824";
const strRandom = "16258345538919";
const strToken  = btoa(cmd);

var i = nTimeStamp + strRandom + strUser + strAppID + strToken;
const strSign = md5(i);

fetch("https://242.sinotrack.com/APP/AppJson.asp", {
  "headers": {
    "accept": "text/plain, */*; q=0.01",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://www.sinotrack.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "strAppID="+strAppID+
          "&strUser="+strUser+
          "&nTimeStamp="+nTimeStamp+
          "&strRandom="+strRandom+
          "&strSign="+strSign+
          "&strToken="+strToken,
  "method": "POST"
}).then((response) => {
  // console.log(response);
  return response.json();
}).then((data) => {
  // console.log("DATA");
  // console.log(data);
  let s = JSON.stringify(data);
  fs.writeFileSync("track/"+year+"_"+(month+1).toString().padStart(2, "0")+"_"+day.toString().padStart(2, "0")+".json", s); 
});

}

const now = new Date();

const year = now.getFullYear();
const month = now.getMonth();
// const day = now.getDate();

for (let day = 1; day <= 31; day++) {
 dumpTrack(year,month,day);
}

console.log("Bye.");