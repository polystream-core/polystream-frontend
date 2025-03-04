const { exec } = require("child_process");

const curl = "curl 'https://maya.um.edu.my/sitsvision/wrd/SIW_TTQ' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ms;q=0.6' \
  -H 'Cache-Control: max-age=0' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Cookie: EVISIONLOGINLANG=; EVISIONLOGINHTV=; SESSIONSALT=8A4B79AD-04C8-4686-B22A-EF7154853D22; EVISIONID=3C325BB5-B530-4B9B-A354-F7FCA8421C84; EVISION_SESSION=Y; JSESSIONID=47E73FA1C5E7D71E322F102836847603; cookiesession1=678B28A52E88605C4FB9023C2F6A53BC; _ga=GA1.3.882230351.1740984227; _gid=GA1.3.477130885.1740984227; _ga_2SYVGN90D1=GS1.3.1740984227.1.1.1740984227.0.0.0' \
  -H 'Origin: https://maya.um.edu.my' \
  -H 'Referer: https://maya.um.edu.my/' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: \"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: \"macOS\"' \
  --data-raw '%25.WEB_HEAD.MENSYS.1=DiFRdV6f6MYGXhzkWO1jW02xhLAwEJmpwtaOzB0T1ws%3D%3Bnew%3B%3B&MHDC.DUMMY.MENSYS.1=S2199179_680601934409591259182&SEQN.DUMMY.MENSYS.1=2&NKEY.DUMMY.MENSYS.1=54EF903C07A64F96RermeqyC4Xhy241vpXoGXICI6cMoujrXW7ZUnjZP-wusmLVgbunoDuShGZY-sIQl1DSjzrbkWH-0F0i7Rr1NtnKrqy19AANSm2_VM3lT4dG00sziMjBWWznkdC349PbXJTlXmWcZhiJbcWp6tnGiaYH0n1M84W8-6qfcoiznb86R-riV1gglFfnnaeoJE50Q_ZoCM8ZHDPaFx7mc4qBNPg&RUN_MODE.DUMMY.MENSYS.1=ACT%251BHASH%3D1EC82E31617D14FDCEDFB97D8C71207DD25CD702AE5F0DBCBCB660093E545C2E497A9294147CDC9A3F165A6DC6BDD48307A1AD301AF641B93FED86E04DBAB51A&%25.DUMMY.MENSYS.1=5%2Fg7IoKmtHvT%2Bv2lPPrrTskf00LW7hufXFEDINdcf8s%3D%3Bnew%3B%3B&%23.TTE.MENSYS.1-1=2nbxmVv6waBZg4wilfIAztUddnibW9T9TMm02rzH%2Frc%3D%3Bmod%3BD43E03E9%3BDRJDQVNNLVNUVS0wMDEEIkM1MA%3D%3D&ANSWER.TTQ.MENSYS.1=S2199179%2F1%7EBCWWIDFTST03&DUM_FIXT.TTQ.MENSYS.1=&DUM_FIXT.TTQ.MENSYS.2=&ANSWER.TTQ.MENSYS.3=2024%7ES1&DUM_FIXT.TTQ.MENSYS.3=&DUM_FIXT.TTQ.MENSYS.4=&%23.TTQ.MENSYS.1=ecbh4cjgztcwXJ4Wi7mhLqUPf7CEHHiImjHLCpPto28%3D%3Bmod%3BA4640AF9%3BAzJDMQ0SQ0FTTS1TVFUtMDAxBCJDNTA%3D&%23.TTQ.MENSYS.2=nKWxL8j819yiXpXCOqHoKn5kuS3TlP0CKw860dXGLHI%3D%3Bmod%3B882DBB0C%3BAzJDMg0SQ0FTTS1TVFUtMDAxBCJDNTA%3D&%23.TTQ.MENSYS.3=iTSHl89d4bV8bbKZNk6XvkcCsNGll3I7meZdZOZZ07Q%3D%3Bmod%3B2A75804B%3BAzJDNQ0SQ0FTTS1TVFUtMDAxBCJDNTA%3D&%23.TTQ.MENSYS.4=enZj78QbJZ%2BvpYkk8a%2BcOz%2BppSBL7uHrBsesXfRnGwA%3D%3Bmod%3B9F194B98%3BBDJDNTANEkNBU00tU1RVLTAwMQQiQzUw&%23.TTE.MENSYS.1-1=2nbxmVv6waBZg4wilfIAztUddnibW9T9TMm02rzH%2Frc%3D%3Bmod%3BD43E03E9%3BDRJDQVNNLVNUVS0wMDEEIkM1MA%3D%3D&NEXT.DUMMY.MENSYS.1=Continue&%25.DUMMY.MENSYS.1=5%2Fg7IoKmtHvT%2Bv2lPPrrTskf00LW7hufXFEDINdcf8s%3D%3Bnew%3B%3B'"
const checkInterval = 1000; // Time in milliseconds before retrying (5s)

function executeCurl() {
    exec(curl, (error, stdout, stderr) => {
        if (stdout.includes("still under process")) {
            console.log("Status is still under process. Retrying...");
            setTimeout(executeCurl, checkInterval);
        } else {
            console.log("Final result received. Exiting loop.");
        }
    });
}

executeCurl();
