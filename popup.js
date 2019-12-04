const createComingContestNode = function (contest) {
    let node = document.createElement('div');
    node.classList.add('wrapper');

    let iconWrapper = document.createElement('div');
    iconWrapper.classList.add('wrap');

    let iconImg = document.createElement('img');
    iconImg.classList.add('icon');
    iconImg.src = chrome.runtime.getURL(`images/logo/${contest.siteName}.png`);
    iconImg.onclick = function () {
        chrome.tabs.update({ url: contest.siteUrl });
    }

    let textWrapper = document.createElement('div');
    textWrapper.classList.add('wrap');

    let titleText = document.createElement('p');
    titleText.classList.add('title');
    titleText.textContent = contest.name;

    let beginAtText = document.createElement('p');
    beginAtText.classList.add('beginAt');
    beginAtText.textContent = TIMEFORMATTER.beginAt2Readable(contest.beginAt);

    let untilText = document.createElement('p');
    untilText.classList.add('until');
    untilText.setAttribute('data-contestname', contest.name);
    untilText.textContent = TIMEFORMATTER.until2Readable(contest.beginAt - new Date());

    let durationText = document.createElement('p');
    durationText.classList.add('duration');
    durationText.textContent = TIMEFORMATTER.duration2Readable(contest.duration);

    iconWrapper.appendChild(iconImg);

    textWrapper.appendChild(titleText);
    textWrapper.appendChild(beginAtText);
    textWrapper.appendChild(untilText);
    textWrapper.appendChild(durationText);

    node.appendChild(iconWrapper);
    node.appendChild(textWrapper);

    return node;
}

const createOnGoingContestNode = function (contest) {
    let node = document.createElement('div');
    node.classList.add('wrapper');

    let iconWrapper = document.createElement('div');
    iconWrapper.classList.add('wrap');

    let iconImg = document.createElement('img');
    iconImg.classList.add('icon');
    iconImg.src = chrome.runtime.getURL(`images/logo/${contest.siteName}.png`);
    iconImg.onclick = function () {
        chrome.tabs.update({ url: contest.siteUrl });
    }

    let textWrapper = document.createElement('div');
    textWrapper.classList.add('wrap');

    let titleText = document.createElement('p');
    titleText.classList.add('title');
    titleText.textContent = contest.name;

    let tagSpan = document.createElement('span');
    tagSpan.classList.add('ongoing');
    tagSpan.textContent = '진행 중';

    let beginAtText = document.createElement('p');
    beginAtText.classList.add('beginAt');
    beginAtText.textContent = TIMEFORMATTER.beginAt2Readable(contest.beginAt);

    let untilText = document.createElement('p');
    untilText.classList.add('until');
    untilText.setAttribute('data-contestname', contest.name);
    untilText.textContent = TIMEFORMATTER.until2Readable(contest.endAt - new Date());

    let durationText = document.createElement('p');
    durationText.classList.add('duration');
    durationText.textContent = TIMEFORMATTER.duration2Readable(contest.duration);

    iconWrapper.appendChild(iconImg);

    titleText.appendChild(tagSpan);

    textWrapper.appendChild(titleText);
    textWrapper.appendChild(beginAtText);
    textWrapper.appendChild(untilText);
    textWrapper.appendChild(durationText);

    node.appendChild(iconWrapper);
    node.appendChild(textWrapper);

    return node;
}

const renderContests = function (results) {
    if (!results) return;

    let contestList = document.querySelector('.contestList');

    contestList.innerHTML = "";

    let keys = Object.keys(results);
    keys.forEach(k => results[k] = CONTEST.createContest(results[k]));
    let sortedKeys = keys.sort((a, b) => results[a].beginAt - results[b].beginAt);

    for (let key of sortedKeys) {
        let item = results[key];
        let node = null;

        if (item.isComing()) node = createComingContestNode(item);
        else if (item.isOnGoing()) node = createOnGoingContestNode(item);

        if(node !== null) contestList.appendChild(node);
    }
};

const updateUntil = function (contest) {
    const now = new Date();
    const untilText = document.querySelector('p.until[data-contestname="' + contest.name + '"]');
    const c = CONTEST.createContest(contest);

    if (c.isComing()) untilText.textContent = TIMEFORMATTER.until2Readable(contest.beginAt - now.getTime());
    else if (c.isOnGoing()) untilText.textContent = TIMEFORMATTER.until2Readable(contest.endAt - now.getTime());
}

STORAGE.getStorage(CONSTANTS.TYPELOCAL, [CONSTANTS.CONTESTS, CONSTANTS.BADGECOLOR], function (obj) {
    const contests = obj[CONSTANTS.CONTESTS] || {};
    const contestKeys = Object.keys(contests);
    contestKeys.forEach(k => contests[k] = CONTEST.createContest(contests[k]));

    const badgeColor = obj[CONSTANTS.BADGECOLOR];

    const nOnGoing = Object.keys(contestKeys.filter(k => contests[k].isOnGoing())).length.toString();
    const nComing = Object.keys(contestKeys.filter(k => contests[k].isComing())).length.toString();
    chrome.browserAction.setBadgeText({ text: `${nComing}/${nOnGoing}` });
    chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });

    renderContests(obj[CONSTANTS.CONTESTS]);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command == 'renderContests') renderContests(msg.data[CONSTANTS.CONTESTS]);
    if (msg.command == 'updateUntil') updateUntil(msg.data);
});