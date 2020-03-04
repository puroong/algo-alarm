import ContestMap from './dtos/contestMap';
import Contest from './dtos/contest';
import Judge from "./judges/Judge";
import JudgeStorage from "./storages/judgeStorage";
import RenderContestsMessage from "./messages/renderContestsMessage";
import JudgePort from "./judgePort";

class BackgroundScriptRunner {
    private storage: JudgeStorage;
    private judges: Array<Judge>;
    private port: JudgePort = new JudgePort();

    constructor(storage: JudgeStorage, judges: Array<Judge>) {
        this.storage = storage;
        this.judges = judges;
    }

    run() {
        this.port.setOnConnectListener();
        this.storage.setStorageOnChangedListener(this.port);
        this.setAppOnStartupListener();
        this.setAppOnInstalledListener();
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