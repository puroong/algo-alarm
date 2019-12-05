import Constant from './modules/constant';
import ContestMap from './modules/types/contestMap';
import Contest from './modules/types/contest';
import MessageFactory from './modules/messages/messageFactory';
import Storage from './modules/storage';
import Crawler from './modules/crawler';

const intervalQueue: number[] = [];

chrome.storage.onChanged.addListener(function (changes: any, namespaces: any) {
    let rawContests: any, rawJudges: any, badgeColor: string;

    if (changes[Constant.StorageKey.CONTESTS]) rawContests = changes[Constant.StorageKey.CONTESTS].newValue;
    if (changes[Constant.StorageKey.JUDGES]) rawJudges = changes[Constant.StorageKey.JUDGES].newValue;
    if (changes[Constant.StorageKey.BADGECOLOR]) badgeColor = changes[Constant.StorageKey.BADGECOLOR].newValue;

    if (badgeColor) {
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
    }
    console.log(rawContests);
    if (rawContests) {
        const contestKeys = Object.keys(rawContests);
        let contests: ContestMap = {};
        contestKeys.forEach(key => contests[key] = new Contest(
            rawContests[key].siteName,
            rawContests[key].siteUrl,
            rawContests[key].name,
            rawContests[key].beginAt,
            rawContests[key].endAt,
            rawContests[key].duration
        ));
        console.log('rawContests: ')
        console.log(rawContests)
        console.log('contests: ')
        console.log(contests);

        const nOnGoing: string = Object.keys(contestKeys.filter(key => contests[key].isOnGoing())).length.toString();
        const nComing: string = Object.keys(contestKeys.filter(key => contests[key].isComing())).length.toString();
        chrome.browserAction.setBadgeText({ text: `${nComing}/${nOnGoing}` });
        chrome.runtime.sendMessage(MessageFactory.createMessage(Constant.MessageType.RENDERCONTESTS, contests));

        intervalQueue.forEach(interval => {
            clearInterval(interval);
        })
        intervalQueue.length = 0;

        for (let key of contestKeys) {
            const interval: number = setInterval(function () {
                const now: Date = new Date();
                chrome.runtime.sendMessage(MessageFactory.createMessage(Constant.MessageType.UPDATETIME, contests[key]));

                if (contests[key].isOver()) {
                    delete contests[key];
                    clearInterval(interval);
                    Storage.setStorage(Constant.StorageType.LOCAL, { [Constant.StorageKey.CONTESTS]: contests }, function() { });
                }
            }, 1000);
        }
    }
});

// check contest on *CHROME* start
chrome.runtime.onStartup.addListener(function () {
    Crawler.crawlContests();
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
    Storage.setStorage(Constant.StorageType.LOCAL, { [Constant.StorageKey.BADGECOLOR]: badgeColor, [Constant.StorageKey.JUDGES]: judges }, function () {
        Crawler.crawlContests();
    })
});