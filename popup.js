// acmicpc.net, codeforces.com
// TODO: needs to be customizable with options
const contestLists = {
    'acmicpc': {
        'url': 'https://www.acmicpc.net/contest/official/list',
    },
    'codeforces': {
        'url': 'https://codeforces.com/contests',
    }
};
const intervalQueues = [];

const formatBeginAt = function (timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let fmt = `시작일자: ${year}년 ${month}월 ${day}일  ${hour}시 ${minute}분 ${second}초`;
    return fmt;
};

const formatUntil = function (msTime) {
    let sTime = Math.floor(msTime / 1000);

    let day = Math.floor(sTime / 86400);
    let hour = Math.floor((sTime - day * 86400) / 3600);
    let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
    let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

    let fmt = '남은시간: ';
    if (day != 0) fmt += `${day}일 `;
    if (hour != 0) fmt += `${hour}시간 `;
    if (minute != 0) fmt += `${minute}분 `;
    if (second != 0) fmt += `${second}초 `;

    return fmt;
};

const formatDuration = function (msTime) {
    let sTime = Math.floor(msTime / 1000);

    let day = Math.floor(sTime / 86400);
    let hour = Math.floor((sTime - day * 86400) / 3600);
    let minute = Math.floor((sTime - day * 86400 - hour * 3600) / 60);
    let second = Math.floor((sTime - day * 86400 - hour * 3600 - minute * 60));

    let fmt = '';
    if (day != 0) fmt += `${day}일 `;
    if (hour != 0) fmt += `${hour}시간 `;
    if (minute != 0) fmt += `${minute}분 `;
    if (second != 0) fmt += `${second}초 `;

    return fmt;
};

const renderContests = function (results) {
    if (!results) return;

    let contestList = document.querySelector('.contestList');

    contestList.innerHTML = "";
    for (let interval of intervalQueues) clearInterval(interval);

    for (let key of Object.keys(results)) {
        let item = results[key];

        let newCard = document.createElement('div');
        newCard.classList.add('wrapper');

        let iconWrapper = document.createElement('div');
        iconWrapper.classList.add('wrap');

        let iconImg = document.createElement('img');
        iconImg.classList.add('icon');
        iconImg.src = chrome.runtime.getURL(`images/logo/${item.siteName}.png`);
        iconImg.onclick = function () {
            chrome.tabs.update({ url: contestLists[item.siteName].url });
        }

        let textWrapper = document.createElement('div');
        textWrapper.classList.add('wrap');

        let titleText = document.createElement('p');
        titleText.classList.add('title');
        titleText.textContent = item.name;

        let beginAtText = document.createElement('p');
        beginAtText.classList.add('beginAt');
        beginAtText.textContent = formatBeginAt(item.beginAt);

        let untilText = document.createElement('p');
        untilText.classList.add('until');
        untilText.textContent = formatUntil(item.beginAt - new Date());
        let interval = setInterval(function () {
            let msTime = item.beginAt - new Date();
            if (msTime >= 0) untilText.textContent = formatUntil(msTime);
            else {
                chrome.storage.sync.get(['contest'], function (value) {
                    delete value.contest[item.name];
                    chrome.storage.sync.set({ 'contest': value.contest });
                });
                let idx;
                if (idx = intervalQueues.indexOf(this) !== -1) {
                    intervalQueues.splice(idx);
                    clearInterval(this);
                }
            }
        }, 1000);
        intervalQueues.push(interval);

        let durationText = document.createElement('p');
        durationText.classList.add('duration');
        durationText.textContent = formatDuration(item.duration);

        iconWrapper.appendChild(iconImg);

        textWrapper.appendChild(titleText);
        textWrapper.appendChild(beginAtText);
        textWrapper.appendChild(untilText);
        textWrapper.appendChild(durationText);

        newCard.appendChild(iconWrapper);
        newCard.appendChild(textWrapper);

        contestList.appendChild(newCard);
    }
};

chrome.storage.sync.get(['contest'], function (value) {
    let results = value.contest || {};
    renderContests(results);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    renderContests();
});