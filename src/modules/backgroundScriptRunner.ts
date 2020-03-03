import ContestMap from './dtos/contestMap';
import Contest from './dtos/contest';
import UpdateTimeMessage from './messages/updateTimeMessage'
import Message from './messages/message';
import Judge from "./judges/Judge";
import JudgeStorage from "./storages/judgeStorage";
import Port = chrome.runtime.Port;
import IntervalQueue from "./IntervalQueue";
import UnsetTimeIntervalMessage from "./messages/unsetTimeIntervalMessage";
import SetTimeIntervalMessage from "./messages/setTimeIntervalMessage";

class BackgroundScriptRunner {
    private storage: JudgeStorage;
    private judges: Array<Judge>;

    constructor(storage: JudgeStorage, judges: Array<Judge>) {
        this.storage = storage;
        this.judges = judges;
    }

    run() {
        this.setPortOnConnectListener()
        this.setStorageOnChangedListener()
        this.setAppOnStartupListener()
        this.setAppOnInstalledListener()
    }


    private setPortOnConnectListener() {
        chrome.runtime.onConnect.addListener(this.initPort.bind(this));
    }

    private initPort(port: Port) {
        const intervalQueue = new IntervalQueue();

        port.onMessage.addListener(function(message: Message) {
            this.portOnMessageListener(port, intervalQueue, message);
        }.bind(this));

        port.onDisconnect.addListener(function () {
            intervalQueue.clear();
        }.bind(this));
    }

    private portOnMessageListener(port: Port, intervalQueue: IntervalQueue, message: Message) {
        if (message.type === SetTimeIntervalMessage.TYPE) {
            const rawContests: any = message.data;
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

            this.validateContests(port, intervalQueue, contests);
        } else if (message.type === UnsetTimeIntervalMessage.TYPE) {
            intervalQueue.clear();
        }
    }

    private validateContests(port: Port, intervalQueue: IntervalQueue, contests: ContestMap) {
        intervalQueue.clear();

        const contestKeys = Object.keys(contests);
        for (let key of contestKeys) {
            const interval: number = setInterval(function () {
                port.postMessage(new UpdateTimeMessage(contests[key]));

                if (contests[key].isOver()) {
                    delete contests[key];
                    clearInterval(interval);
                    this.storage.set({ [JudgeStorage.KEY.CONTESTS]: contests }, function () { });
                }
            }, 1000);
            intervalQueue.push(interval);
        }
    }


    private setStorageOnChangedListener() {
        chrome.storage.onChanged.addListener(this.renderChanges.bind(this));
    }

    private renderChanges(changes: any, namespaces: any) {
        this.renderBadgeColor(changes);
        this.renderBadgeText(changes);
    }

    private renderBadgeColor(changes: any) {
        let badgeColor: string = null;
        if (changes[JudgeStorage.KEY.BADGECOLOR]) {
            badgeColor = changes[JudgeStorage.KEY.BADGECOLOR].newValue;
        }

        if (badgeColor) {
            chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
        }
    }

    private renderBadgeText(changes: any) {
        let rawContests: any;
        let contestKeys: Array<string>;
        let contests: ContestMap = {};

        if (changes[JudgeStorage.KEY.CONTESTS]) {
            rawContests = changes[JudgeStorage.KEY.CONTESTS].newValue;
            contestKeys = Object.keys(rawContests);
            contestKeys.forEach(key => contests[key] = new Contest(
                rawContests[key].siteName,
                rawContests[key].siteUrl,
                rawContests[key].name,
                rawContests[key].beginAt,
                rawContests[key].endAt,
                rawContests[key].duration
            ));
        }


        if (rawContests) {
            const nOnGoing: string = Object.keys(contestKeys.filter(key => contests[key].isOnGoing())).length.toString();
            const nComing: string = Object.keys(contestKeys.filter(key => contests[key].isComing())).length.toString();
            chrome.browserAction.setBadgeText({ text: `${nComing}/${nOnGoing}` });
        }
    }


    private setAppOnStartupListener() {
        chrome.runtime.onStartup.addListener(this.updateContests.bind(this));
    }

    private async updateContests() {
        for(let judge of this.judges) {
            const newContests = await judge.getContests();
            const storedContests = await this.storage.getContests();
            const contests = this.unionContests(newContests, storedContests);

            await this.storage.setContests(contests);
        }
    }
    private unionContests(newContests: ContestMap, storedContests: ContestMap): ContestMap {
        const contests: ContestMap = {};
        const storedContestKeys = Object.keys(storedContests);
        storedContestKeys.forEach(key => contests[key] = storedContests[key].clone())

        const newContestKeys = Object.keys(newContests);

        for (let key of newContestKeys) {
            if (this.isNotStored(key, storedContests)) contests[key] = newContests[key];
        }

        return contests;
    }

    private isNotStored(key: string, contests: ContestMap): boolean {
        return contests[key] === undefined;
    }


    private setAppOnInstalledListener() {
        chrome.runtime.onInstalled.addListener(this.setBadgeColorAndUpdateContests.bind(this));
    }

    private async setBadgeColorAndUpdateContests() {
        await this.storage.setBadgeColor('red');
        this.updateContests();
    }
}

export default BackgroundScriptRunner;