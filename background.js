const intervalQueue = [];

chrome.storage.onChanged.addListener(function (changes, namespaces) {
    let contests, judges, badgeColor;

    if (changes[CONSTANTS.CONTESTS]) contests = changes[CONSTANTS.CONTESTS].newValue;
    if (changes[CONSTANTS.JUDGES]) judges = changes[CONSTANTS.JUDGES].newValue;
    if (changes[CONSTANTS.BADGECOLOR]) badgeColor = changes[CONSTANTS.BADGECOLOR].newValue;

    if (badgeColor) {
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
    }
    if (contests) {
        const nContests = Object.keys(contests).length.toString();
        chrome.browserAction.setBadgeText({ text: nContests });
        chrome.runtime.sendMessage(new MESSAGE("renderContests", contests));

        intervalQueue.forEach(interval => {
            clearInterval(interval);
        })
        intervalQueue.length = 0;

        const contestKeys = Object.keys(contests);
        for (let key of contestKeys) {
            const interval = setInterval(function () {
                const now = new Date();
                chrome.runtime.sendMessage(new MESSAGE("updateUntil", contests[key]));

                if (contests[key].beginAt - now.getTime() < 0) {
                    delete contests[key];
                    clearInterval(interval);
                    STORAGE.setStorage(CONSTANTS.TYPELOCAL, { [CONSTANTS.CONTESTS]: contests, function() { } });
                }
            }, 1000);
        }
    }
});

// check contest on *CHROME* start
chrome.runtime.onStartup.addListener(function () {
    CRAWLER.getContests();
})
// check contest after install
chrome.runtime.onInstalled.addListener(function () {
    let judges = {
        'acmicpc': {
            'name': 'acmicpc',
            'url': 'https://www.acmicpc.net/contest/official/list',
        },
        'codeforces': {
            'name': 'codeforces',
            'url': 'https://codeforces.com/contests',
        }
    };
    let badgeColor = 'red';
    STORAGE.setStorage(CONSTANTS.TYPELOCAL, { [CONSTANTS.BADGECOLOR]: badgeColor, [CONSTANTS.JUDGES]: judges }, function () {
        CRAWLER.getContests();
    })
});