import Constant from "./modules/constant";
import Storage from "./modules/storage";
import Contest from "./modules/types/contest";
import TimeFormatter from "./modules/timeFormatter";
import ContestMap from "./modules/types/contestMap";

const createComingContestNode = function (contest: Contest) {
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
    beginAtText.textContent = TimeFormatter.beginAt2Readable(contest.beginAt);

    let untilText = document.createElement('p');
    untilText.classList.add('until');
    untilText.setAttribute('data-contestname', contest.name);
    untilText.textContent = TimeFormatter.until2Readable(contest.beginAt - new Date().getTime());

    let durationText = document.createElement('p');
    durationText.classList.add('duration');
    durationText.textContent = TimeFormatter.duration2Readable(contest.duration);

    iconWrapper.appendChild(iconImg);

    textWrapper.appendChild(titleText);
    textWrapper.appendChild(beginAtText);
    textWrapper.appendChild(untilText);
    textWrapper.appendChild(durationText);

    node.appendChild(iconWrapper);
    node.appendChild(textWrapper);

    return node;
}

const createOnGoingContestNode = function (contest: Contest) {
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
    beginAtText.textContent = TimeFormatter.beginAt2Readable(contest.beginAt);

    let untilText = document.createElement('p');
    untilText.classList.add('until');
    untilText.setAttribute('data-contestname', contest.name);
    untilText.textContent = TimeFormatter.until2Readable(contest.endAt - new Date().getTime());

    let durationText = document.createElement('p');
    durationText.classList.add('duration');
    durationText.textContent = TimeFormatter.duration2Readable(contest.duration);

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

const renderContests = function (contests: ContestMap) {
    console.log('render contests');
    console.log(contests);
    if (contests === undefined) return;

    let contestList = document.querySelector('.contestList');

    contestList.innerHTML = "";

    let keys: string[] = Object.keys(contests);
    let sortedKeys = keys.sort((a, b) => contests[a].beginAt - contests[b].beginAt);

    for (let key of sortedKeys) {
        let item: Contest = contests[key];
        let node = null;

        if (item.isComing()) node = createComingContestNode(item);
        else if (item.isOnGoing()) node = createOnGoingContestNode(item);

        if(node !== null) contestList.appendChild(node);
    }
};

const updateUntil = function (contest: Contest) {
    const now = new Date();
    const untilText = document.querySelector('p.until[data-contestname="' + contest.name + '"]');

    if (contest.isComing()) untilText.textContent = TimeFormatter.until2Readable(contest.beginAt - now.getTime());
    else if (contest.isOnGoing()) untilText.textContent = TimeFormatter.until2Readable(contest.endAt - now.getTime());
}

Storage.getStorage(Constant.StorageType.LOCAL, [Constant.StorageKey.CONTESTS, Constant.StorageKey.BADGECOLOR], function (obj: any) {
    const rawContests: any = obj[Constant.StorageKey.CONTESTS] || {};
    const contestKeys = Object.keys(rawContests);
    let contests: ContestMap = {};
    contestKeys.forEach(key => rawContests[key] = contests[key] = new Contest(
        rawContests[key].siteName,
        rawContests[key].siteUrl,
        rawContests[key].name,
        rawContests[key].beginAt,
        rawContests[key].endAt,
        rawContests[key].duration
    ));

    const badgeColor = obj[Constant.StorageKey.BADGECOLOR];

    const nOnGoing: string = Object.keys(contestKeys.filter(key => contests[key].isOnGoing())).length.toString();
    const nComing: string = Object.keys(contestKeys.filter(key => contests[key].isComing())).length.toString();
    chrome.browserAction.setBadgeText({ text: `${nComing}/${nOnGoing}` });
    chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });

    renderContests(contests);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command == Constant.MessageType.RENDERCONTESTS) {
        const rawContests: any = msg.data;
        const contestKeys: string[] = Object.keys(rawContests);
        let contests: ContestMap = {};
        contestKeys.forEach(key => contests[key] = new Contest(
            rawContests[key].siteName,
            rawContests[key].siteUrl,
            rawContests[key].name,
            rawContests[key].beginAt,
            rawContests[key].endAt,
            rawContests[key].duration
        ));

        console.log('msg: ')
        console.log(msg);
        console.log('rawContests: ')
        console.log(rawContests)
        console.log('contests: ')
        console.log(contests);
        renderContests(contests);
    }
    else if (msg.command == Constant.MessageType.UPDATETIME) {
        const rawContest: any = msg.data;
        const contest = new Contest(
            rawContest.siteName,
            rawContest.siteUrl,
            rawContest.name,
            rawContest.beginAt,
            rawContest.endAt,
            rawContest.duration
        );

        updateUntil(contest);
    }
});