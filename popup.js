const renderContests = function (results) {
    if (!results) return;

    let contestList = document.querySelector('.contestList');

    contestList.innerHTML = "";

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
            chrome.tabs.update({ url: item.siteUrl });
        }

        let textWrapper = document.createElement('div');
        textWrapper.classList.add('wrap');

        let titleText = document.createElement('p');
        titleText.classList.add('title');
        titleText.textContent = item.name;

        let beginAtText = document.createElement('p');
        beginAtText.classList.add('beginAt');
        beginAtText.textContent = TIMEFORMATTER.beginAt2Readable(item.beginAt);

        let untilText = document.createElement('p');
        untilText.classList.add('until');
        untilText.setAttribute('data-contestname', item.name);
        untilText.textContent = TIMEFORMATTER.until2Readable(item.beginAt - new Date());

        let durationText = document.createElement('p');
        durationText.classList.add('duration');
        durationText.textContent = TIMEFORMATTER.duration2Readable(item.duration);

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

const updateUntil = function (contest) {
    const now = new Date();
    const untilText = document.querySelector('p.until[data-contestname="' + contest.name + '"]');

    untilText.textContent = TIMEFORMATTER.until2Readable(contest.beginAt - now.getTime());
}

STORAGE.getStorage(CONSTANTS.TYPELOCAL, [CONSTANTS.CONTESTS, CONSTANTS.BADGECOLOR], function (obj) {
    const contests = obj[CONSTANTS.CONTESTS] || {};
    const nContests = Object.keys(contests).length.toString();
    const badgeColor = obj[CONSTANTS.BADGECOLOR];

    chrome.browserAction.setBadgeText({ text: nContests });
    chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });

    renderContests(obj[CONSTANTS.CONTESTS]);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command == 'renderContests') renderContests(msg.data[CONSTANTS.CONTESTS]);
    if (msg.command == 'updateUntil') updateUntil(msg.data);
});