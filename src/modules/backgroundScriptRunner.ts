import Constant from './constant';
import ContestMap from './types/contestMap';
import Contest from './types/contest';
import MessageFactory from './messages/messageFactory';
import Storage from './storages/storage';
import Crawler from './crawler';
import Message from './messages/message';

export default class BackgroundScriptRunner {
    private storage: Storage

    constructor(storage: Storage) {
        this.storage = storage
    }

    run() {
        this.setStorageOnChangedListener()
        this.setPortOnConnectListener()
        // check contest on *CHROME* start
        this.crawlContests()
        // check contest after install
        this.setAppOnInstalledListener()
    }

    private setPortOnConnectListener() {
        chrome.runtime.onConnect.addListener(function (port) {
            const intervalQueue: number[] = [];
        
            const unsetTimeIntervals = function () {
                while (intervalQueue.length != 0) {
                    clearInterval(intervalQueue.pop())
                }
            }
        
            const setTimeIntervals = function (contests: ContestMap) {
                unsetTimeIntervals();
        
                const contestKeys = Object.keys(contests);
                for (let key of contestKeys) {
                    const interval: number = setInterval(function () {
                        port.postMessage(MessageFactory.createMessage(Constant.MessageType.UPDATETIME, contests[key]));
        
                        if (contests[key].isOver()) {
                            delete contests[key];
                            clearInterval(interval);
                            this.storage.setItemsAndRunCallback({ [Constant.StorageKey.CONTESTS]: contests }, function () { });
                        }
                    }, 1200);
                    intervalQueue.push(interval);
                }
            }
        
            port.onMessage.addListener(function (msg: Message) {
                if (msg.command == Constant.MessageType.SETTIMEINTERVAL) {
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
        
                    setTimeIntervals(contests);
                } else if (msg.command == Constant.MessageType.UNSETTIMEINTERVAL) {
                    unsetTimeIntervals();
                }
            });
        
            port.onDisconnect.addListener(function () {
                unsetTimeIntervals();
            });
        });
    }

    private setStorageOnChangedListener() {
        chrome.storage.onChanged.addListener(function (changes: any, namespaces: any) {
            let rawContests: any, rawJudges: any, badgeColor: string;
        
            if (changes[Constant.StorageKey.CONTESTS]) rawContests = changes[Constant.StorageKey.CONTESTS].newValue;
            if (changes[Constant.StorageKey.JUDGES]) rawJudges = changes[Constant.StorageKey.JUDGES].newValue;
            if (changes[Constant.StorageKey.BADGECOLOR]) badgeColor = changes[Constant.StorageKey.BADGECOLOR].newValue;
        
            if (badgeColor) {
                chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
            }
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
        
                const nOnGoing: string = Object.keys(contestKeys.filter(key => contests[key].isOnGoing())).length.toString();
                const nComing: string = Object.keys(contestKeys.filter(key => contests[key].isComing())).length.toString();
                chrome.browserAction.setBadgeText({ text: `${nComing}/${nOnGoing}` });
            }
        });
    }

    private crawlContests() {
        chrome.runtime.onStartup.addListener(function () {
            Crawler.crawlContests();
        })
    }

    private setAppOnInstalledListener() {
        const storage = this.storage

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
            storage.setItemsAndRunCallback({ [Constant.StorageKey.BADGECOLOR]: badgeColor, [Constant.StorageKey.JUDGES]: judges }, function () {
                Crawler.crawlContests();
            })
        });
    }
}