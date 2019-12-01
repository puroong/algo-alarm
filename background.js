// acmicpc.net, codeforces.com
// TODO: needs to be customizable with options
const contestLists = [
    {
        'url': 'https://x434f5253.herokuapp.com/https://www.acmicpc.net/contest/official/list',
        'name': 'acmicpc'
    },
    {
        'url': 'https://x434f5253.herokuapp.com/https://codeforces.com/contests',
        'name': 'codeforces'
    }
]

const kt2iso = function (kt) {
    let dateItems = kt.split(" ");

    let year = undefined;
    let month = undefined;
    let day = undefined;
    let hour = undefined;
    let minute = undefined;
    let second = undefined;

    if (dateItems[0]) year = dateItems[0].slice(0, dateItems[0].length-1);
    if (dateItems[1]) month = dateItems[1].slice(0, dateItems[1].length - 1);
    if (dateItems[2]) day = dateItems[2].slice(0, dateItems[2].length - 1);
    if (dateItems[3]) hour = dateItems[3].slice(0, dateItems[3].length - 1);
    if (dateItems[4]) minute = dateItems[4].slice(0, dateItems[4].length - 1);
    if (dateItems[5]) second = dateItems[5].slice(0, dateItems[5].length - 1);
    
    let isoFmt;
    if (second) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    if (minute) isoFmt = `${year}-${month}-${day} ${hour}:${minute}:00`;
    if (hour) isoFmt = `${year}-${month}-${day} ${hour}:00:00`;

    return isoFmt;
}

const parser = (function () {
    return {
        'acmicpc': function (html) {
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(html, 'text/html');

            let nodeList = htmlDoc.querySelectorAll('tr.info');
            let contestList = [];

            for (let nodeItem of nodeList) {
                contestList.push(nodeItem);
            }

            let result = {};
            for (let contestItem of contestList) {
                let datas = contestItem.querySelectorAll('td');
                let name = datas[0].querySelector('a').innerText.trim();
                let beginAt = new Date(kt2iso(datas[3].innerText)).getTime();
                let endAt = new Date(kt2iso(datas[4].innerText)).getTime();
                let duration = endAt - beginAt;

                result[name] = {
                    siteName: 'acmicpc',
                    name: name,
                    beginAt: beginAt,
                    duration: duration
                };
            }

            return result;
        },
        'codeforces': function (html) {
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(html, 'text/html');

            let contestTable = htmlDoc.querySelector('div.datatable');
            let nodeList = contestTable.querySelectorAll('tr[data-contestid]');

            let result = {};
            for (let nodeItem of nodeList) {
                let datas = nodeItem.querySelectorAll('td');
                let name = datas[0].innerText.trim();
                // cors-anywhere 서버가 북미에 있어서인지 코드포스에서 북미 시간대를 가져옴.
                // 따라서 로컬 타임존 오프셋(new Date().getTimezoneOffset)이랑 북미 타임존 오프셋(3시간 = 180분)을 서로 뺀 다음에
                // 북미 시간대에 더했음.
                let msTimeZoneOffset = (-180 - new Date().getTimezoneOffset()) * 60 * 1000;
                let beginAt = new Date(datas[2].innerText.split('UTC')[0]).getTime() + msTimeZoneOffset;
                let duration = parseInt(datas[3].innerText.split(':')[0]) * 3600000;

                result[name] = {
                    siteName: 'codeforces',
                    name: name,
                    beginAt: beginAt,
                    duration: duration
                };
            }

            return result;
        }
    }
})()

const parseContest = function (siteName, html) {
    let results = parser[siteName](html);
    return results;
}

const checkContest = function () {
    for (let contest of contestLists) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let results = parseContest(contest.name, this.responseText);
 
                chrome.storage.sync.get(['contest'], function (value) {
                    let today = new Date();
                    value.contest = value.contest || {};
                    let validContests = {};
                    for (let key of Object.keys(value.contest)) {
                        if (value.contest[key].beginAt - today.getTime() > 0) validContests[key] = value.contest[key];
                    }
                    let newContests = results;
                    let totalResults = JSON.parse(JSON.stringify(validContests));

                    for (let key of Object.keys(newContests)) {
                        if (totalResults[key] === undefined) totalResults[key] = newContests[key];
                    }

                    chrome.storage.sync.set({ 'contest': totalResults }, function () {
                        console.log(totalResults+" are set");
                    })
                });
            } else {
                console.log(this.statusText);
            }
        }
        xhr.open('GET', contest.url);
        xhr.send();
    }
}

// check contest on *CHROME* start
chrome.runtime.onStartup.addListener(function () {
    checkContest();
})
// check contest after install
chrome.runtime.onInstalled.addListener(function () {
    checkContest();
})